# AI Paneli: Dinamik Hesap Seçici Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AI Paneli'nin hesap seçicisi, sabit 4 kayıtlık listeden değil, `profiller/` klasöründeki gerçek dosyalardan ve içlerindeki gerçek hesap adlarından beslensin.

**Architecture:** `profiller/*.md` tek gerçek kaynak olur. Sunucu tarafında yeni bir `hesaplariGetir()` fonksiyonu bu klasörü GitHub API üzerinden tarar, her dosyanın içinden gerçek hesap adını (regex ile) çıkarır. `app/page.tsx` (Server Component) bunu render sırasında çağırıp `SohbetEkrani` → `HesapModSecici` zincirine prop olarak geçirir. Sabit `HESAPLAR`/`hesabiBul` kaldırılır.

**Tech Stack:** Next.js 15 App Router, TypeScript, Vitest, `@octokit/rest` (mevcut `lib/github.ts` üzerinden).

## Global Constraints

- Hesap adı çıkarma etiket önceliği (bu sırayla, ilk dolu olan kazanır): `"Kullanıcı adı"` → `"İşletme adı"` → `"Kanal adı"` (etiket alt-dizge eşleşmesi, örn. "Kullanıcı adı (Instagram)" da "Kullanıcı adı" ile eşleşir).
- Bir alanın değeri `"_("` ile başlıyorsa doldurulmamış (placeholder) sayılır.
- Hiçbir alan dolu değilse: dosya adından türetilmiş Title Case başlık + `" (profil eksik)"` son eki kullanılır (örn. `restoran-instagram.md` → `"Restoran Instagram (profil eksik)"`).
- `id` = dosya adı, `.md` uzantısı olmadan (örn. `restoran-instagram`).
- Tekil dosya okuma hatası (`dosyaOku` fırlatırsa) o dosyayı listeden atlar, diğerlerini etkilemez. `profiller/` klasörü hiç yoksa boş dizi döner.
- Yeni test dosyalarında, mock edilen bir fonksiyon dışarıda tanımlı bir `const` ile factory içinde referans veriliyorsa MUTLAKA `vi.hoisted(() => ({...}))` kullanılır (bu projede daha önce birden fazla kez TDZ hatasına yol açtı — bkz. proje hafızası).
- Hesap tipine göre ikon/rozet gösterimi, caching veya `profiller/` dışı bir depolama kapsam dışıdır (YAGNI).

---

### Task 1: `lib/github.ts` — dizin listeleme

**Files:**
- Modify: `ai-panel/lib/github.ts`
- Modify: `ai-panel/lib/github.test.ts`

**Interfaces:**
- Consumes: mevcut `octokitOlustur()`, `depoBilgisi()` (aynı dosyada, değişmez)
- Produces: `dizinListele(yol: string): Promise<string[]>` — Task 2 (`hesaplariGetir`) bunu kullanır. Döndürdüğü değerler `.md` dosyalarının tam yollarıdır (örn. `"profiller/sahsi-instagram.md"`).

- [ ] **Step 1: Başarısız testi yaz**

`ai-panel/lib/github.test.ts` dosyasının en altına, `describe("github", ...)` bloğunun içine (kapanış `});`'den hemen önce) şu testleri ekle:

```ts
  it("dizindeki .md dosyalarinin yollarini listeler", async () => {
    getContentMock.mockResolvedValue({
      data: [
        { type: "file", name: "sahsi-instagram.md", path: "profiller/sahsi-instagram.md" },
        { type: "file", name: "restoran-instagram.md", path: "profiller/restoran-instagram.md" },
        { type: "file", name: "README.md.bak", path: "profiller/README.md.bak" },
        { type: "dir", name: "alt-klasor", path: "profiller/alt-klasor" },
      ],
    });

    const yollar = await dizinListele("profiller");

    expect(yollar).toEqual([
      "profiller/sahsi-instagram.md",
      "profiller/restoran-instagram.md",
    ]);
  });

  it("dizin yoksa bos dizi doner", async () => {
    getContentMock.mockRejectedValue({ status: 404 });

    const yollar = await dizinListele("profiller");

    expect(yollar).toEqual([]);
  });
```

Ve dosyanın en üstündeki import satırını güncelle:

```ts
import { dosyaOku, dosyaYaz, dizinListele } from "./github";
```

- [ ] **Step 2: Testin başarısız olduğunu doğrula**

```bash
cd ai-panel
npx vitest run lib/github.test.ts
```

Beklenen: FAIL — `dizinListele` export edilmiyor.

- [ ] **Step 3: Uygulamayı yaz**

`ai-panel/lib/github.ts` dosyasının sonuna (mevcut `dosyaYaz` fonksiyonundan sonra) ekle:

```ts

export async function dizinListele(yol: string): Promise<string[]> {
  const octokit = octokitOlustur();
  const { owner, repo, branch } = depoBilgisi();
  try {
    const yanit = await octokit.repos.getContent({ owner, repo, path: yol, ref: branch });
    const veri = yanit.data;
    if (!Array.isArray(veri)) return [];
    return veri
      .filter((oge: any) => oge.type === "file" && oge.name.endsWith(".md"))
      .map((oge: any) => oge.path as string);
  } catch (hata: any) {
    if (hata.status === 404) return [];
    throw hata;
  }
}
```

- [ ] **Step 4: Testin geçtiğini doğrula**

```bash
npx vitest run lib/github.test.ts
```

Beklenen: PASS — 6 test (mevcut 4 + yeni 2).

- [ ] **Step 5: Commit**

```bash
cd ..
git add ai-panel/lib/github.ts ai-panel/lib/github.test.ts
git commit -m "ai-panel: profiller klasorunu listeleyen dizinListele fonksiyonu"
```

---

### Task 2: `lib/hesaplariGetir.ts` — profil dosyalarından hesap listesi çıkarma

**Files:**
- Create: `ai-panel/lib/hesaplariGetir.ts`
- Create: `ai-panel/lib/hesaplariGetir.test.ts`

**Interfaces:**
- Consumes: `dizinListele`, `dosyaOku` (Task 1 ve mevcut `lib/github.ts`), `HesapTanimi` tipi (`lib/modTanimlari.ts`, değişmeden kalıyor: `{ id: string; ad: string; profilDosyasi: string }`)
- Produces: `hesaplariGetir(): Promise<HesapTanimi[]>` — Task 3 (`sistemTalimati.ts`) ve Task 4 (`app/page.tsx`) bunu kullanır.

- [ ] **Step 1: Başarısız testi yaz**

`ai-panel/lib/hesaplariGetir.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const { dizinListeleMock, dosyaOkuMock } = vi.hoisted(() => ({
  dizinListeleMock: vi.fn(),
  dosyaOkuMock: vi.fn(),
}));

vi.mock("./github", () => ({
  dizinListele: dizinListeleMock,
  dosyaOku: dosyaOkuMock,
}));

import { hesaplariGetir } from "./hesaplariGetir";

describe("hesaplariGetir", () => {
  beforeEach(() => {
    dizinListeleMock.mockReset();
    dosyaOkuMock.mockReset();
  });

  it("kullanici adi alanindan gercek hesap adini cikarir", async () => {
    dizinListeleMock.mockResolvedValue(["profiller/sahsi-instagram.md"]);
    dosyaOkuMock.mockResolvedValue(
      "# Profil\n\n## Kimlik\n\n- **Kullanıcı adı:** @egenisankoc (instagram.com/egenisankoc)\n"
    );

    const hesaplar = await hesaplariGetir();

    expect(hesaplar).toEqual([
      {
        id: "sahsi-instagram",
        ad: "@egenisankoc (instagram.com/egenisankoc)",
        profilDosyasi: "profiller/sahsi-instagram.md",
      },
    ]);
  });

  it("kullanici adi yoksa isletme adini kullanir", async () => {
    dizinListeleMock.mockResolvedValue(["profiller/lezzetduragi-restoran.md"]);
    dosyaOkuMock.mockResolvedValue(
      "## İşletme\n\n- **İşletme adı:** Lezzet Durağı\n- **Konum (şehir/semt):** _(doldurulacak)_\n"
    );

    const hesaplar = await hesaplariGetir();

    expect(hesaplar[0].ad).toBe("Lezzet Durağı");
  });

  it("tum alanlar placeholder ise dosya adindan baslik turetir", async () => {
    dizinListeleMock.mockResolvedValue(["profiller/restoran-instagram.md"]);
    dosyaOkuMock.mockResolvedValue(
      "## İşletme\n\n- **İşletme adı:** _(doldurulacak)_\n- **Kullanıcı adı (Instagram):** _(doldurulacak)_\n"
    );

    const hesaplar = await hesaplariGetir();

    expect(hesaplar[0].ad).toBe("Restoran Instagram (profil eksik)");
  });

  it("dizin bossa bos dizi doner", async () => {
    dizinListeleMock.mockResolvedValue([]);

    const hesaplar = await hesaplariGetir();

    expect(hesaplar).toEqual([]);
  });

  it("tekil dosya okuma hatasinda o dosyayi atlar, digerlerini doner", async () => {
    dizinListeleMock.mockResolvedValue(["profiller/bozuk.md", "profiller/sahsi-instagram.md"]);
    dosyaOkuMock.mockImplementation(async (yol: string) => {
      if (yol === "profiller/bozuk.md") throw new Error("ag hatasi");
      return "- **Kullanıcı adı:** @egenisankoc\n";
    });

    const hesaplar = await hesaplariGetir();

    expect(hesaplar).toHaveLength(1);
    expect(hesaplar[0].id).toBe("sahsi-instagram");
  });
});
```

- [ ] **Step 2: Testin başarısız olduğunu doğrula**

```bash
cd ai-panel
npx vitest run lib/hesaplariGetir.test.ts
```

Beklenen: FAIL — `./hesaplariGetir` modülü bulunamadı.

- [ ] **Step 3: Uygulamayı yaz**

`ai-panel/lib/hesaplariGetir.ts`:

```ts
import { dizinListele, dosyaOku } from "./github";
import type { HesapTanimi } from "./modTanimlari";

const ETIKET_ONCELIGI = ["Kullanıcı adı", "İşletme adı", "Kanal adı"];

function alanDegeriBul(icerik: string, etiket: string): string | null {
  const satirlar = icerik.split("\n");
  for (const satir of satirlar) {
    const eslesme = satir.match(/^-\s*\*\*(.+?):\*\*\s*(.+)$/);
    if (!eslesme) continue;
    const [, bulunanEtiket, deger] = eslesme;
    if (bulunanEtiket.includes(etiket)) {
      return deger.trim();
    }
  }
  return null;
}

function hesapAdiCikar(icerik: string, dosyaAdi: string): string {
  for (const etiket of ETIKET_ONCELIGI) {
    const deger = alanDegeriBul(icerik, etiket);
    if (deger && !deger.startsWith("_(")) {
      return deger;
    }
  }
  const baslik = dosyaAdi
    .replace(/\.md$/, "")
    .split("-")
    .map((parca) => parca.charAt(0).toUpperCase() + parca.slice(1))
    .join(" ");
  return `${baslik} (profil eksik)`;
}

export async function hesaplariGetir(): Promise<HesapTanimi[]> {
  const dosyaYollari = await dizinListele("profiller");
  const hesaplar: HesapTanimi[] = [];

  for (const yol of dosyaYollari) {
    let icerik: string | null;
    try {
      icerik = await dosyaOku(yol);
    } catch {
      continue;
    }
    if (icerik === null) continue;

    const dosyaAdi = yol.split("/").pop()!;
    const id = dosyaAdi.replace(/\.md$/, "");
    const ad = hesapAdiCikar(icerik, dosyaAdi);

    hesaplar.push({ id, ad, profilDosyasi: yol });
  }

  return hesaplar;
}
```

- [ ] **Step 4: Testin geçtiğini doğrula**

```bash
npx vitest run lib/hesaplariGetir.test.ts
```

Beklenen: PASS — 5 test.

- [ ] **Step 5: Tüm kütüphane testlerini birlikte çalıştır**

```bash
npm test
```

Beklenen: PASS — tüm testler (yeni hesaplariGetir testleri dahil).

- [ ] **Step 6: Commit**

```bash
cd ..
git add ai-panel/lib/hesaplariGetir.ts ai-panel/lib/hesaplariGetir.test.ts
git commit -m "ai-panel: profil dosyalarindan hesap listesi cikaran hesaplariGetir"
```

---

### Task 3: `lib/sistemTalimati.ts` — dinamik hesap listesine geçiş

**Files:**
- Modify: `ai-panel/lib/sistemTalimati.ts`
- Modify: `ai-panel/lib/sistemTalimati.test.ts`

**Interfaces:**
- Consumes: `hesaplariGetir()` (Task 2)
- Produces: `sistemTalimatiOlustur` imzası değişmez (`(ad: ModAdi, hesapId: string | null) => Promise<string>`) — Task 4'teki `app/api/chat/route.ts` zaten bunu aynı imzayla çağırıyor, değişiklik gerekmez.

**Not:** `modTanimlari.ts`'teki eski `hesabiBul`/`HESAPLAR` bu görevde henüz silinmiyor (Task 4'te, son kullanıcıları — `HesapModSecici.tsx`/`SohbetEkrani.tsx` — güncellenirken birlikte temizlenecek). Bu görev sadece `sistemTalimati.ts`'in onları kullanmayı bırakmasıdır.

- [ ] **Step 1: Testi güncelle (RED)**

`ai-panel/lib/sistemTalimati.test.ts` dosyasının tamamını şununla değiştir:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const { dosyaOkuMock, hesaplariGetirMock } = vi.hoisted(() => ({
  dosyaOkuMock: vi.fn(),
  hesaplariGetirMock: vi.fn(),
}));

vi.mock("./github", () => ({ dosyaOku: dosyaOkuMock }));
vi.mock("./hesaplariGetir", () => ({ hesaplariGetir: hesaplariGetirMock }));

import { sistemTalimatiOlustur } from "./sistemTalimati";

describe("sistemTalimati", () => {
  beforeEach(() => {
    dosyaOkuMock.mockReset();
    hesaplariGetirMock.mockReset();
    hesaplariGetirMock.mockResolvedValue([
      { id: "restoran", ad: "Restoran Instagram", profilDosyasi: "profiller/restoran-instagram.md" },
    ]);
  });

  it("tum parcalari birlestirir", async () => {
    dosyaOkuMock.mockImplementation(async (yol: string) => {
      if (yol === "CLAUDE.md") return "KOK TALIMAT";
      if (yol === ".claude/agents/instagram-uzmani.md") return "AJAN TALIMATI";
      if (yol === ".claude/commands/analiz.md") return "KOMUT TALIMATI";
      if (yol === "profiller/restoran-instagram.md") return "PROFIL ICERIGI";
      return null;
    });

    const talimat = await sistemTalimatiOlustur("analiz", "restoran");

    expect(talimat).toContain("KOK TALIMAT");
    expect(talimat).toContain("AJAN TALIMATI");
    expect(talimat).toContain("KOMUT TALIMATI");
    expect(talimat).toContain("PROFIL ICERIGI");
    expect(talimat).toContain("Aktif Hesap Profili (Restoran Instagram)");
  });

  it("hesap verilmezse profil eklemez ve hesap listesini cekmez", async () => {
    dosyaOkuMock.mockImplementation(async (yol: string) => {
      if (yol === "CLAUDE.md") return "KOK TALIMAT";
      if (yol === ".claude/commands/trend.md") return "TREND KOMUTU";
      return null;
    });

    const talimat = await sistemTalimatiOlustur("trend", null);

    expect(talimat).not.toContain("Aktif Hesap Profili");
    expect(talimat).toContain("TREND KOMUTU");
    expect(hesaplariGetirMock).not.toHaveBeenCalled();
  });

  it("bulunamayan dosyalari sessizce atlar", async () => {
    dosyaOkuMock.mockResolvedValue(null);

    const talimat = await sistemTalimatiOlustur("analiz", "restoran");

    expect(talimat).toContain("read_file ve write_file araçlarını");
  });

  it("bilinmeyen hesap id'si icin profil eklemez", async () => {
    dosyaOkuMock.mockImplementation(async (yol: string) => {
      if (yol === "CLAUDE.md") return "KOK TALIMAT";
      return null;
    });

    const talimat = await sistemTalimatiOlustur("analiz", "yok-boyle-hesap");

    expect(talimat).not.toContain("Aktif Hesap Profili");
  });
});
```

- [ ] **Step 2: Testin başarısız olduğunu doğrula**

```bash
cd ai-panel
npx vitest run lib/sistemTalimati.test.ts
```

Beklenen: FAIL — `./hesaplariGetir` mock'u gerçek kodda kullanılmıyor / `hesabiBul` hâlâ çağrılıyor, en az bir test kırmızı.

- [ ] **Step 3: Uygulamayı güncelle**

`ai-panel/lib/sistemTalimati.ts` dosyasının tamamını şununla değiştir:

```ts
import { dosyaOku } from "./github";
import { modBul, type ModAdi } from "./modTanimlari";
import { hesaplariGetir } from "./hesaplariGetir";

export async function sistemTalimatiOlustur(ad: ModAdi, hesapId: string | null): Promise<string> {
  const mod = modBul(ad);
  const parcalar: string[] = [];

  const kokTalimat = await dosyaOku("CLAUDE.md");
  if (kokTalimat) parcalar.push(kokTalimat);

  for (const ajanYolu of mod.ajanDosyalari) {
    const ajanIcerik = await dosyaOku(ajanYolu);
    if (ajanIcerik) parcalar.push(ajanIcerik);
  }

  const komutIcerik = await dosyaOku(mod.komutDosyasi);
  if (komutIcerik) parcalar.push(komutIcerik);

  if (hesapId) {
    const hesaplar = await hesaplariGetir();
    const hesap = hesaplar.find((h) => h.id === hesapId);
    if (hesap) {
      const profilIcerik = await dosyaOku(hesap.profilDosyasi);
      if (profilIcerik) {
        parcalar.push(`## Aktif Hesap Profili (${hesap.ad})\n\n${profilIcerik}`);
      }
    }
  }

  parcalar.push(
    "Bu ekipte web tabanlı bir sohbet arayüzünden çalışıyorsun. read_file ve write_file araçlarını " +
      "kullanarak depodaki dosyaları okuyup yazabilirsin (yollar depo köküne göredir, örn. " +
      "'planlar/2026-07-19-restoran-haftalik-plan.md'). web_search aracıyla güncel bilgiye ulaşabilirsin. " +
      "Chrome ile hesaba doğrudan bakamazsın, görsel/video üretemezsin — bu durumda kullanıcıya PC'deki " +
      "tam ekibi kullanmasını öner."
  );

  return parcalar.join("\n\n---\n\n");
}
```

- [ ] **Step 4: Testin geçtiğini doğrula**

```bash
npx vitest run lib/sistemTalimati.test.ts
```

Beklenen: PASS — 4 test.

- [ ] **Step 5: Tüm kütüphane testlerini birlikte çalıştır**

```bash
npm test
```

Beklenen: PASS — tüm testler (bu noktada `modTanimlari.ts`'teki `HESAPLAR`/`hesabiBul` hâlâ mevcut ama artık kullanılmıyor — Task 4'te silinecek).

- [ ] **Step 6: Commit**

```bash
cd ..
git add ai-panel/lib/sistemTalimati.ts ai-panel/lib/sistemTalimati.test.ts
git commit -m "ai-panel: sistemTalimati artik dinamik hesaplariGetir kullaniyor"
```

---

### Task 4: UI'ı dinamik listeye bağla + eski sabit listeyi temizle

**Files:**
- Modify: `ai-panel/app/page.tsx`
- Modify: `ai-panel/components/SohbetEkrani.tsx`
- Modify: `ai-panel/components/HesapModSecici.tsx`
- Modify: `ai-panel/lib/modTanimlari.ts`
- Modify: `ai-panel/lib/modTanimlari.test.ts`

**Interfaces:**
- Consumes: `hesaplariGetir()` (Task 2), `HesapTanimi` tipi (`lib/modTanimlari.ts`)
- Produces: yok (bu görev bir zincirin son halkası — UI katmanı, otomatik test kapsamı dışı)

**Not:** Bu görev sadece daha önce test edilmiş parçaları birbirine bağlıyor (wiring) — React bileşenlerini mock'lamak kırılgan olacağından, doğrulama gerçek `npm run dev` sunucusu üzerinden tarayıcıyla yapılır.

- [ ] **Step 1: `lib/modTanimlari.ts`'ten eski sabit listeyi kaldır**

`ai-panel/lib/modTanimlari.ts` dosyasının tamamını şununla değiştir (sondaki `HESAPLAR` dizisi ve `hesabiBul` fonksiyonu kaldırılmış, `HesapTanimi` arayüzü aynen korunmuş hali):

```ts
export type ModAdi =
  | "analiz"
  | "haftalik-plan"
  | "icerik"
  | "trend"
  | "rakip"
  | "geri-bildirim"
  | "profil-ekle";

export interface ModTanimi {
  ad: ModAdi;
  baslik: string;
  ajanDosyalari: string[];
  komutDosyasi: string;
}

export const MODLAR: ModTanimi[] = [
  {
    ad: "analiz",
    baslik: "Hesap Analizi",
    ajanDosyalari: [".claude/agents/instagram-uzmani.md"],
    komutDosyasi: ".claude/commands/analiz.md",
  },
  {
    ad: "haftalik-plan",
    baslik: "Haftalık İçerik Planı",
    ajanDosyalari: [".claude/agents/instagram-uzmani.md"],
    komutDosyasi: ".claude/commands/haftalik-plan.md",
  },
  {
    ad: "icerik",
    baslik: "İçerik Üretimi",
    ajanDosyalari: [".claude/agents/instagram-uzmani.md"],
    komutDosyasi: ".claude/commands/icerik.md",
  },
  {
    ad: "trend",
    baslik: "Trend Araştırması",
    ajanDosyalari: [".claude/agents/trend-analisti.md"],
    komutDosyasi: ".claude/commands/trend.md",
  },
  {
    ad: "rakip",
    baslik: "Rakip İnceleme",
    ajanDosyalari: [".claude/agents/rakip-analisti.md"],
    komutDosyasi: ".claude/commands/rakip.md",
  },
  {
    ad: "geri-bildirim",
    baslik: "Geri Bildirim",
    ajanDosyalari: [],
    komutDosyasi: ".claude/commands/geri-bildirim.md",
  },
  {
    ad: "profil-ekle",
    baslik: "Yeni Profil Ekle",
    ajanDosyalari: [],
    komutDosyasi: ".claude/commands/profil-ekle.md",
  },
];

export function modBul(ad: ModAdi): ModTanimi {
  const mod = MODLAR.find((m) => m.ad === ad);
  if (!mod) throw new Error(`Bilinmeyen mod: ${ad}`);
  return mod;
}

export interface HesapTanimi {
  id: string;
  ad: string;
  profilDosyasi: string;
}
```

- [ ] **Step 2: `modTanimlari.test.ts`'i güncelle**

`ai-panel/lib/modTanimlari.test.ts` dosyasının tamamını şununla değiştir:

```ts
import { describe, it, expect } from "vitest";
import { modBul, MODLAR } from "./modTanimlari";

describe("modTanimlari", () => {
  it("bilinen modu bulur", () => {
    expect(modBul("analiz").baslik).toBe("Hesap Analizi");
  });

  it("bilinmeyen mod hata firlatir", () => {
    // @ts-expect-error kasitli gecersiz deger
    expect(() => modBul("yok")).toThrow();
  });

  it("tum modlarin komut dosyasi tanimli", () => {
    for (const mod of MODLAR) {
      expect(mod.komutDosyasi.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 3: `app/page.tsx`'i güncelle**

`ai-panel/app/page.tsx` dosyasının tamamını şununla değiştir:

```tsx
import SohbetEkrani from "../components/SohbetEkrani";
import { hesaplariGetir } from "../lib/hesaplariGetir";

export default async function AnaSayfa() {
  const hesaplar = await hesaplariGetir();

  return (
    <main className="ana-sayfa">
      <SohbetEkrani hesaplar={hesaplar} />
    </main>
  );
}
```

- [ ] **Step 4: `components/HesapModSecici.tsx`'i güncelle**

`ai-panel/components/HesapModSecici.tsx` dosyasının tamamını şununla değiştir:

```tsx
"use client";

import { MODLAR } from "../lib/modTanimlari";
import type { HesapTanimi } from "../lib/modTanimlari";

interface Props {
  hesaplar: HesapTanimi[];
  seciliMod: string;
  seciliHesap: string;
  modDegisti: (mod: string) => void;
  hesapDegisti: (hesap: string) => void;
}

export default function HesapModSecici({
  hesaplar,
  seciliMod,
  seciliHesap,
  modDegisti,
  hesapDegisti,
}: Props) {
  return (
    <div className="hesap-mod-secici">
      <select value={seciliHesap} onChange={(e) => hesapDegisti(e.target.value)}>
        {hesaplar.map((hesap) => (
          <option key={hesap.id} value={hesap.id}>
            {hesap.ad}
          </option>
        ))}
      </select>
      <select value={seciliMod} onChange={(e) => modDegisti(e.target.value)}>
        {MODLAR.map((mod) => (
          <option key={mod.ad} value={mod.ad}>
            {mod.baslik}
          </option>
        ))}
      </select>
    </div>
  );
}
```

- [ ] **Step 5: `components/SohbetEkrani.tsx`'i güncelle**

`ai-panel/components/SohbetEkrani.tsx` içinde importlar bölümüne (`import type { SohbetMesaji, SohbetGorseli } from "../lib/types";` satırının altına) ekle:

```tsx
import type { HesapTanimi } from "../lib/modTanimlari";
```

Sonra şu bloğu:

```tsx
export default function SohbetEkrani() {
  const [seciliHesap, setSeciliHesap] = useState("restoran");
```

şununla değiştir:

```tsx
interface Props {
  hesaplar: HesapTanimi[];
}

export default function SohbetEkrani({ hesaplar }: Props) {
  const [seciliHesap, setSeciliHesap] = useState(hesaplar[0]?.id ?? "");
```

Ve şu bloğu:

```tsx
      <HesapModSecici
        seciliMod={seciliMod}
        seciliHesap={seciliHesap}
        modDegisti={setSeciliMod}
        hesapDegisti={setSeciliHesap}
      />
```

şununla değiştir:

```tsx
      <HesapModSecici
        hesaplar={hesaplar}
        seciliMod={seciliMod}
        seciliHesap={seciliHesap}
        modDegisti={setSeciliMod}
        hesapDegisti={setSeciliHesap}
      />
```

- [ ] **Step 6: Tip kontrolü ve testleri çalıştır**

```bash
cd ai-panel
npx tsc --noEmit
npm test
```

Beklenen: `tsc` sıfır hata; `npm test` tüm testler PASS (artık `HESAPLAR`/`hesabiBul` testleri yok, toplam sayı düşer ama hepsi PASS olmalı).

- [ ] **Step 7: Manuel doğrulama — tarayıcıda gerçek listeyi gör**

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` aç, giriş yap. Hesap dropdown'unda şunları göreceksin:
- `sahsi-instagram` → gerçek doldurulmuş değer: `"@egenisankoc (instagram.com/egenisankoc)"`
- `restoran-instagram`, `youtube-kanali`, `google-maps` → henüz doldurulmadıkları için `"Restoran Instagram (profil eksik)"`, `"Youtube Kanali (profil eksik)"`, `"Google Maps (profil eksik)"` gibi görünecek

Bu, tasarımın beklediği davranış: `profiller/restoran-instagram.md` dosyasına gerçek bilgiler (örn. `fuegorestaurant`) işlendiğinde, bir sonraki sayfa yüklemesinde dropdown otomatik olarak gerçek adı gösterecek — kod değişikliği gerekmez.

- [ ] **Step 8: Commit**

```bash
cd ..
git add ai-panel/app/page.tsx ai-panel/components/HesapModSecici.tsx ai-panel/components/SohbetEkrani.tsx ai-panel/lib/modTanimlari.ts ai-panel/lib/modTanimlari.test.ts
git commit -m "ai-panel: hesap secici artik profiller klasorunden dinamik besleniyor"
```

---
