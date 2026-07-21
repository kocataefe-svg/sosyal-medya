# AI Paneli — Görsel Yükleme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AI Paneli sohbet arayüzüne, mesaj başına en fazla 4 ekran görüntüsü/görsel ekleyip Claude'a gönderme özelliği eklemek — CLAUDE.md'nin "Instagram Insights sadece ekran görüntüsüyle paylaşılabilir" akışını mobil panelde çalışır hale getirmek.

**Architecture:** Görseller seçildiğinde tarayıcıda (canvas API) uzun kenar 1568px'e küçültülüp JPEG'e sıkıştırılır, mevcut JSON tabanlı `/api/chat` isteğine base64 olarak eklenir. Sunucu tarafında görsel sayısı/tipi tekrar doğrulanır, `lib/claude.ts` Anthropic'in çok bloklu (`image` + `text`) mesaj formatına çevirir. Görsel yoksa mevcut düz-metin davranışı hiç değişmez.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Vitest, `@anthropic-ai/sdk` 0.32.1 (kurulu sürüm — `Anthropic.ImageBlockParam`/`TextBlockParam` bu sürümde mevcut), tarayıcı Canvas/FileReader/Image API'leri (ek bağımlılık yok).

## Global Constraints

- Mesaj başına en fazla **4** görsel (`MAKSIMUM_GORSEL_SAYISI`).
- Kabul edilen tipler: `image/jpeg`, `image/png`, `image/webp` (HEIC/HEIF gibi tarayıcının çizemediği formatlar hata olarak reddedilir).
- İstemci tarafı küçültme zorunlu: uzun kenar 1568px'i aşarsa oranlı küçültülür, JPEG kalite 0.8 ile sıkıştırılır — Vercel'in istek boyutu sınırına takılmayı önler.
- Görsel yoksa (`gorseller` alanı yok/boş) mevcut davranış birebir korunur — geriye dönük uyumluluk zorunlu, mevcut testler bozulmamalı.
- `lib/` katmanındaki saf mantık (veri modeli, doğrulama, mesaj format dönüşümü) TDD ile test edilir. Canvas'a bağımlı kod (`gorseliKucult`) ve API route'lar proje konvansiyonuna uygun şekilde manuel/canlı doğrulanır (bkz. `docs/superpowers/plans/2026-07-19-ai-paneli.md` Task 9 notu).
- **Bu proje canlıda Vercel'e bağlı (push = otomatik production deploy).** Her görev sonunda sadece yerel commit yapılır; `git push origin master` SADECE son görevde (Task 5) çalıştırılır.

---

### Task 1: Veri Modeli ve Görsel Doğrulama Mantığı

**Files:**
- Modify: `ai-panel/lib/types.ts`
- Create: `ai-panel/lib/gorselDogrula.ts`
- Create: `ai-panel/lib/gorselDogrula.test.ts`

**Interfaces:**
- Consumes: yok
- Produces: `SohbetGorseli` arayüzü (`{ mediaType: "image/jpeg"|"image/png"|"image/webp"; data: string }`), genişletilmiş `SohbetMesaji` (`{ rol; icerik; gorseller?: SohbetGorseli[] }`), `MAKSIMUM_GORSEL_SAYISI` sabiti, `GECERLI_MEDIA_TIPLERI` sabiti, `gorselListesiGecerliMi(gorseller: SohbetGorseli[]): { gecerli: boolean; hata?: string }` — Task 2, 3, 4 bunları kullanır.

- [ ] **Step 1: `lib/types.ts`'i genişlet**

`ai-panel/lib/types.ts` dosyasının TAM içeriğini şununla değiştir:

```ts
export interface SohbetGorseli {
  mediaType: "image/jpeg" | "image/png" | "image/webp";
  data: string;
}

export interface SohbetMesaji {
  rol: "user" | "assistant";
  icerik: string;
  gorseller?: SohbetGorseli[];
}
```

- [ ] **Step 2: Başarısız testi yaz**

`ai-panel/lib/gorselDogrula.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { gorselListesiGecerliMi, MAKSIMUM_GORSEL_SAYISI } from "./gorselDogrula";
import type { SohbetGorseli } from "./types";

function ornekGorsel(mediaType: SohbetGorseli["mediaType"] = "image/jpeg"): SohbetGorseli {
  return { mediaType, data: "aGVsbG8=" };
}

describe("gorselDogrula", () => {
  it("bos listeyi gecerli sayar", () => {
    expect(gorselListesiGecerliMi([])).toEqual({ gecerli: true });
  });

  it("sinir icindeki gorsel sayisini gecerli sayar", () => {
    const gorseller = Array.from({ length: MAKSIMUM_GORSEL_SAYISI }, () => ornekGorsel());
    expect(gorselListesiGecerliMi(gorseller)).toEqual({ gecerli: true });
  });

  it("sinir asan gorsel sayisini reddeder", () => {
    const gorseller = Array.from({ length: MAKSIMUM_GORSEL_SAYISI + 1 }, () => ornekGorsel());
    const sonuc = gorselListesiGecerliMi(gorseller);
    expect(sonuc.gecerli).toBe(false);
    expect(sonuc.hata).toContain(String(MAKSIMUM_GORSEL_SAYISI));
  });

  it("gecerli media tiplerini kabul eder", () => {
    expect(gorselListesiGecerliMi([ornekGorsel("image/jpeg")]).gecerli).toBe(true);
    expect(gorselListesiGecerliMi([ornekGorsel("image/png")]).gecerli).toBe(true);
    expect(gorselListesiGecerliMi([ornekGorsel("image/webp")]).gecerli).toBe(true);
  });

  it("gecersiz media tipini reddeder", () => {
    const gorsel = { mediaType: "image/gif", data: "aGVsbG8=" } as unknown as SohbetGorseli;
    const sonuc = gorselListesiGecerliMi([gorsel]);
    expect(sonuc.gecerli).toBe(false);
    expect(sonuc.hata).toContain("image/gif");
  });

  it("bos veriyi reddeder", () => {
    const gorsel: SohbetGorseli = { mediaType: "image/jpeg", data: "" };
    const sonuc = gorselListesiGecerliMi([gorsel]);
    expect(sonuc.gecerli).toBe(false);
  });
});
```

- [ ] **Step 3: Testin başarısız olduğunu doğrula**

```bash
cd ai-panel
npx vitest run lib/gorselDogrula.test.ts
```

Beklenen: FAIL — `./gorselDogrula` modülü bulunamadı.

- [ ] **Step 4: Uygulamayı yaz**

`ai-panel/lib/gorselDogrula.ts`:

```ts
import type { SohbetGorseli } from "./types";

export const MAKSIMUM_GORSEL_SAYISI = 4;
export const GECERLI_MEDIA_TIPLERI = ["image/jpeg", "image/png", "image/webp"] as const;

export interface GorselDogrulamaSonucu {
  gecerli: boolean;
  hata?: string;
}

export function gorselListesiGecerliMi(gorseller: SohbetGorseli[]): GorselDogrulamaSonucu {
  if (gorseller.length > MAKSIMUM_GORSEL_SAYISI) {
    return {
      gecerli: false,
      hata: `En fazla ${MAKSIMUM_GORSEL_SAYISI} görsel gönderebilirsin.`,
    };
  }

  for (const gorsel of gorseller) {
    if (!GECERLI_MEDIA_TIPLERI.includes(gorsel.mediaType as (typeof GECERLI_MEDIA_TIPLERI)[number])) {
      return { gecerli: false, hata: `Desteklenmeyen görsel tipi: ${gorsel.mediaType}` };
    }
    if (!gorsel.data) {
      return { gecerli: false, hata: "Görsel verisi boş olamaz." };
    }
  }

  return { gecerli: true };
}
```

- [ ] **Step 5: Testin geçtiğini doğrula**

```bash
npx vitest run lib/gorselDogrula.test.ts
```

Beklenen: PASS — 6 test.

- [ ] **Step 6: Tüm test paketini çalıştır (regresyon kontrolü)**

```bash
npm test
```

Beklenen: PASS — önceki 28 test + yeni 6 test = 34 test, hepsi geçer.

- [ ] **Step 7: Commit**

```bash
cd ..
git add ai-panel/lib/types.ts ai-panel/lib/gorselDogrula.ts ai-panel/lib/gorselDogrula.test.ts
git commit -m "ai-panel: gorsel veri modeli + dogrulama mantigi (lib/gorselDogrula.ts)"
```

Bu görevde **push YOK** — sadece yerel commit (bkz. Global Constraints).

---

### Task 2: `lib/claude.ts` — Görsel İçeren Mesajları Anthropic Formatına Çevirme

**Files:**
- Modify: `ai-panel/lib/claude.ts:60-63`
- Modify: `ai-panel/lib/claude.test.ts`

**Interfaces:**
- Consumes: `SohbetGorseli`, genişletilmiş `SohbetMesaji` (Task 1)
- Produces: `sohbetIstegiGonder`'ın davranışı değişmez (aynı imza) ama artık `gorseller` içeren mesajları `Anthropic.ImageBlockParam[] + TextBlockParam` olarak gönderir — Task 3 ve Task 4 bu davranışa güvenir.

**Not:** Kurulu SDK sürümü `@anthropic-ai/sdk@0.32.1`. `Anthropic.ImageBlockParam` şu şekildedir: `{ type: "image"; source: { type: "base64"; media_type: "image/jpeg"|"image/png"|"image/gif"|"image/webp"; data: string } }`. `Anthropic.TextBlockParam`: `{ type: "text"; text: string }`. `Anthropic.MessageParam.content`, `string | Array<TextBlockParam | ImageBlockParam | ToolUseBlockParam | ToolResultBlockParam>` kabul eder — bu yüzden ek tip zorlaması (`as unknown as ...`) GEREKMEZ, doğrudan tip uyumludur.

- [ ] **Step 1: Başarısız testleri yaz**

`ai-panel/lib/claude.test.ts` dosyasında, mevcut `describe("claude", () => { ... })` bloğunun İÇİNE, son testten (`"maksimum dongu sinirina ulasinca durur"`) SONRA şu iki testi ekle:

```ts

  it("gorsel iceren mesaji cok blokla api'ye gonderir", async () => {
    createMock.mockResolvedValue({
      stop_reason: "end_turn",
      content: [{ type: "text", text: "Ekran goruntusunu inceledim." }],
      usage: { input_tokens: 200, output_tokens: 30 },
    });

    const sonuc = await sohbetIstegiGonder({
      sistemTalimati: "Sen bir asistansin.",
      mesajlar: [
        {
          rol: "user",
          icerik: "bu ekran goruntusunu analiz et",
          gorseller: [{ mediaType: "image/jpeg", data: "aGVsbG8=" }],
        },
      ],
    });

    expect(sonuc.cevap).toBe("Ekran goruntusunu inceledim.");
    const gonderilenIstek = createMock.mock.calls[0][0];
    expect(gonderilenIstek.messages[0]).toEqual({
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: "aGVsbG8=" } },
        { type: "text", text: "bu ekran goruntusunu analiz et" },
      ],
    });
  });

  it("gorsel olmayan mesaji hala duz metin olarak gonderir", async () => {
    createMock.mockResolvedValue({
      stop_reason: "end_turn",
      content: [{ type: "text", text: "ok" }],
      usage: { input_tokens: 10, output_tokens: 5 },
    });

    await sohbetIstegiGonder({
      sistemTalimati: "Sen bir asistansin.",
      mesajlar: [{ rol: "user", icerik: "selam" }],
    });

    const gonderilenIstek = createMock.mock.calls[0][0];
    expect(gonderilenIstek.messages[0]).toEqual({ role: "user", content: "selam" });
  });
```

- [ ] **Step 2: Testlerin başarısız olduğunu doğrula**

```bash
cd ai-panel
npx vitest run lib/claude.test.ts
```

Beklenen: FAIL — yeni iki test, `gonderilenIstek.messages[0]` mevcut kodda her zaman `{ role, content: m.icerik }` (düz string) döndüğü için ilk yeni testte eşleşme hatası verir.

- [ ] **Step 3: `lib/claude.ts`'i güncelle**

`ai-panel/lib/claude.ts` dosyasında şu bloğu (satır 60-63):

```ts
  const mesajGecmisi: Anthropic.MessageParam[] = params.mesajlar.map((m) => ({
    role: m.rol,
    content: m.icerik,
  }));
```

Şununla değiştir:

```ts
  const mesajGecmisi: Anthropic.MessageParam[] = params.mesajlar.map((m) => {
    if (!m.gorseller || m.gorseller.length === 0) {
      return { role: m.rol, content: m.icerik };
    }
    const gorselBloklari: Anthropic.ImageBlockParam[] = m.gorseller.map((g) => ({
      type: "image",
      source: { type: "base64", media_type: g.mediaType, data: g.data },
    }));
    const metinBlogu: Anthropic.TextBlockParam = { type: "text", text: m.icerik };
    return { role: m.rol, content: [...gorselBloklari, metinBlogu] };
  });
```

- [ ] **Step 4: Testlerin geçtiğini doğrula**

```bash
npx vitest run lib/claude.test.ts
```

Beklenen: PASS — 6 test (önceki 4 + yeni 2).

- [ ] **Step 5: Tip kontrolü**

```bash
npx tsc --noEmit
```

Beklenen: hata yok.

- [ ] **Step 6: Tüm test paketini çalıştır**

```bash
npm test
```

Beklenen: PASS — 36 test.

- [ ] **Step 7: Commit**

```bash
cd ..
git add ai-panel/lib/claude.ts ai-panel/lib/claude.test.ts
git commit -m "ai-panel: gorsel iceren mesajlari anthropic multi-block formatina cevir"
```

---

### Task 3: `app/api/chat/route.ts` — Sunucu Tarafı Görsel Doğrulama

**Files:**
- Modify: `ai-panel/app/api/chat/route.ts`

**Interfaces:**
- Consumes: `gorselListesiGecerliMi` (Task 1, `lib/gorselDogrula.ts`)
- Produces: `/api/chat`, geçersiz `gorseller` içeren istekleri Claude API'ye ULAŞMADAN 400 ile reddeder — Task 4'teki istemci kodu bu davranışa güvenir (istemci tarafı doğrulamasını atlayan doğrudan çağrılara karşı savunma).

**Not:** Bu proje konvansiyonunda API route'lar mock'lanmaz, gerçek `npm run dev` sunucusu üzerinden `curl` ile doğrulanır (bkz. `docs/superpowers/plans/2026-07-19-ai-paneli.md` Task 9 notu).

- [ ] **Step 1: Import ekle**

`ai-panel/app/api/chat/route.ts` dosyasının en üstündeki import bloğuna (satır 7'den sonra) şunu ekle:

```ts
import { gorselListesiGecerliMi } from "../../../lib/gorselDogrula";
```

- [ ] **Step 2: Doğrulamayı ekle**

Şu bloğu:

```ts
  const govde = (await istek.json().catch(() => null)) as SohbetIstegi | null;
  if (!govde?.mod || !Array.isArray(govde.mesajlar)) {
    return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 });
  }

  try {
```

Şununla değiştir:

```ts
  const govde = (await istek.json().catch(() => null)) as SohbetIstegi | null;
  if (!govde?.mod || !Array.isArray(govde.mesajlar)) {
    return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 });
  }

  for (const mesaj of govde.mesajlar) {
    if (mesaj.gorseller?.length) {
      const dogrulama = gorselListesiGecerliMi(mesaj.gorseller);
      if (!dogrulama.gecerli) {
        return NextResponse.json({ hata: dogrulama.hata }, { status: 400 });
      }
    }
  }

  try {
```

- [ ] **Step 3: Tip kontrolü ve build**

```bash
cd ai-panel
npx tsc --noEmit
npm run build
```

Beklenen: ikisi de hatasız biter.

- [ ] **Step 4: Manuel doğrulama — geçersiz görsel sayısını reddettiğini kontrol et**

```bash
npm run dev
```

Başka bir terminalde, önce giriş yap (yerel `.env.local`'deki test kullanıcısıyla):

```bash
curl -s -c cerez.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"kullaniciAdi":"test","sifre":"test1234"}'
```

Beklenen: `{"basarili":true}`.

5 sahte görselle (sınırı aşan) istek gönder:

```bash
curl -s -b cerez.txt -w "\n[%{http_code}]\n" -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "mod": "analiz",
    "hesap": "restoran",
    "mesajlar": [{
      "rol": "user",
      "icerik": "bunlari incele",
      "gorseller": [
        {"mediaType":"image/jpeg","data":"aGVsbG8="},
        {"mediaType":"image/jpeg","data":"aGVsbG8="},
        {"mediaType":"image/jpeg","data":"aGVsbG8="},
        {"mediaType":"image/jpeg","data":"aGVsbG8="},
        {"mediaType":"image/jpeg","data":"aGVsbG8="}
      ]
    }]
  }'
```

Beklenen: `[400]` ve `{"hata":"En fazla 4 görsel gönderebilirsin."}` — Claude API'ye hiç ulaşılmadan reddedilir (istek anında döner, birkaç saniye beklemez).

- [ ] **Step 5: Manuel doğrulama — geçersiz tipi reddettiğini kontrol et**

```bash
curl -s -b cerez.txt -w "\n[%{http_code}]\n" -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "mod": "analiz",
    "hesap": "restoran",
    "mesajlar": [{
      "rol": "user",
      "icerik": "bunu incele",
      "gorseller": [{"mediaType":"image/gif","data":"aGVsbG8="}]
    }]
  }'
```

Beklenen: `[400]` ve `{"hata":"Desteklenmeyen görsel tipi: image/gif"}`.

`cerez.txt` dosyasını sil (`rm cerez.txt`), sunucuyu durdur (`Ctrl+C`).

- [ ] **Step 6: Commit**

```bash
cd ..
git add ai-panel/app/api/chat/route.ts
git commit -m "ai-panel: sohbet api rotasinda gorsel dogrulama"
```

---

### Task 4: Sohbet Arayüzü — Görsel Seçici, Küçültme, Önizleme, Mesaj Balonunda Gösterim

**Files:**
- Modify: `ai-panel/components/SohbetEkrani.tsx`
- Modify: `ai-panel/components/MesajBalonu.tsx`
- Modify: `ai-panel/app/globals.css`

**Interfaces:**
- Consumes: `gorselListesiGecerliMi`, `MAKSIMUM_GORSEL_SAYISI` (Task 1), `SohbetGorseli` (Task 1), `POST /api/chat` (Task 3)

**Not:** Görsel küçültme (`gorseliKucult`) tarayıcı Canvas/FileReader/Image API'lerine bağımlı — bu API'ler Vitest'in `node` ortamında yoktur, bu yüzden `lib/`'e çıkarılamaz ve unit test edilemez (Task 1'in tasarım kararı). Bu görev tamamen manuel/canlı tarayıcı testiyle doğrulanır.

- [ ] **Step 1: `SohbetEkrani.tsx`'i güncelle**

`ai-panel/components/SohbetEkrani.tsx` dosyasının TAM içeriğini şununla değiştir:

```tsx
"use client";

import { useState } from "react";
import HesapModSecici from "./HesapModSecici";
import MesajBalonu from "./MesajBalonu";
import { gorselListesiGecerliMi, MAKSIMUM_GORSEL_SAYISI } from "../lib/gorselDogrula";
import type { SohbetMesaji, SohbetGorseli } from "../lib/types";

const MAKSIMUM_UZUN_KENAR = 1568;
const JPEG_KALITE = 0.8;

async function gorseliKucult(dosya: File): Promise<SohbetGorseli> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const okuyucu = new FileReader();
    okuyucu.onload = () => resolve(okuyucu.result as string);
    okuyucu.onerror = () => reject(new Error("Dosya okunamadı."));
    okuyucu.readAsDataURL(dosya);
  });

  const resim = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("Görsel okunamadı — desteklenmeyen format olabilir, JPEG/PNG deneyin."));
    img.src = dataUrl;
  });

  let genislik = resim.width;
  let yukseklik = resim.height;
  const uzunKenar = Math.max(genislik, yukseklik);
  if (uzunKenar > MAKSIMUM_UZUN_KENAR) {
    const oran = MAKSIMUM_UZUN_KENAR / uzunKenar;
    genislik = Math.round(genislik * oran);
    yukseklik = Math.round(yukseklik * oran);
  }

  const tuval = document.createElement("canvas");
  tuval.width = genislik;
  tuval.height = yukseklik;
  const baglam = tuval.getContext("2d");
  if (!baglam) throw new Error("Görsel işlenemedi.");
  baglam.drawImage(resim, 0, 0, genislik, yukseklik);

  const sikistirilmisDataUrl = tuval.toDataURL("image/jpeg", JPEG_KALITE);
  const base64Veri = sikistirilmisDataUrl.split(",")[1];

  return { mediaType: "image/jpeg", data: base64Veri };
}

export default function SohbetEkrani() {
  const [seciliHesap, setSeciliHesap] = useState("restoran");
  const [seciliMod, setSeciliMod] = useState("analiz");
  const [mesajlar, setMesajlar] = useState<SohbetMesaji[]>([]);
  const [girdi, setGirdi] = useState("");
  const [seciliGorseller, setSeciliGorseller] = useState<SohbetGorseli[]>([]);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);

  async function gorselSecildi(e: React.ChangeEvent<HTMLInputElement>) {
    const dosyalar = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (dosyalar.length === 0) return;

    setHata(null);
    try {
      const yeniGorseller = await Promise.all(dosyalar.map(gorseliKucult));
      const birlesikGorseller = [...seciliGorseller, ...yeniGorseller];
      const dogrulama = gorselListesiGecerliMi(birlesikGorseller);
      if (!dogrulama.gecerli) {
        setHata(dogrulama.hata ?? "Görsel eklenemedi.");
        return;
      }
      setSeciliGorseller(birlesikGorseller);
    } catch (islenmeHatasi) {
      setHata(
        islenmeHatasi instanceof Error ? islenmeHatasi.message : "Görsel işlenirken bir hata oluştu."
      );
    }
  }

  function gorseliKaldir(index: number) {
    setSeciliGorseller(seciliGorseller.filter((_, i) => i !== index));
  }

  async function mesajGonder(e: React.FormEvent) {
    e.preventDefault();
    const metin = girdi.trim();
    if ((!metin && seciliGorseller.length === 0) || gonderiliyor) return;

    const yeniMesaj: SohbetMesaji = {
      rol: "user",
      icerik: metin,
      ...(seciliGorseller.length > 0 ? { gorseller: seciliGorseller } : {}),
    };
    const yeniMesajlar: SohbetMesaji[] = [...mesajlar, yeniMesaj];
    setMesajlar(yeniMesajlar);
    setGirdi("");
    setSeciliGorseller([]);
    setGonderiliyor(true);
    setHata(null);

    try {
      const yanit = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mod: seciliMod, hesap: seciliHesap, mesajlar: yeniMesajlar }),
      });
      const govde = await yanit.json();
      if (!yanit.ok) {
        setHata(govde.hata || "Bir hata oluştu.");
        return;
      }
      setMesajlar([...yeniMesajlar, { rol: "assistant", icerik: govde.cevap }]);
    } catch {
      setHata("Sunucuya ulaşılamadı, tekrar deneyin.");
    } finally {
      setGonderiliyor(false);
    }
  }

  return (
    <div className="sohbet-ekrani">
      <HesapModSecici
        seciliMod={seciliMod}
        seciliHesap={seciliHesap}
        modDegisti={setSeciliMod}
        hesapDegisti={setSeciliHesap}
      />
      <div className="mesaj-listesi">
        {mesajlar.length === 0 && (
          <p className="bos-mesaj">Hesap ve mod seç, sonra yazmaya başla.</p>
        )}
        {mesajlar.map((mesaj, i) => (
          <MesajBalonu key={i} mesaj={mesaj} />
        ))}
        {gonderiliyor && <div className="mesaj-balonu asistan yukleniyor">Yazıyor...</div>}
      </div>
      {hata && <p className="hata-mesaji">{hata}</p>}
      {seciliGorseller.length > 0 && (
        <div className="gorsel-onizleme-seridi">
          {seciliGorseller.map((gorsel, i) => (
            <div className="gorsel-onizleme" key={i}>
              <img src={`data:${gorsel.mediaType};base64,${gorsel.data}`} alt="Seçilen görsel" />
              <button
                type="button"
                className="gorsel-kaldir-buton"
                onClick={() => gorseliKaldir(i)}
                aria-label="Görseli kaldır"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={mesajGonder} className="mesaj-formu">
        <label className="gorsel-ekle-buton" aria-label="Görsel ekle">
          📎
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={gorselSecildi}
            disabled={seciliGorseller.length >= MAKSIMUM_GORSEL_SAYISI}
          />
        </label>
        <textarea
          value={girdi}
          onChange={(e) => setGirdi(e.target.value)}
          placeholder="Mesajını yaz..."
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              mesajGonder(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={gonderiliyor || (!girdi.trim() && seciliGorseller.length === 0)}
        >
          Gönder
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: `MesajBalonu.tsx`'i güncelle**

`ai-panel/components/MesajBalonu.tsx` dosyasının TAM içeriğini şununla değiştir:

```tsx
import type { SohbetMesaji } from "../lib/types";

export default function MesajBalonu({ mesaj }: { mesaj: SohbetMesaji }) {
  return (
    <div className={`mesaj-balonu ${mesaj.rol === "user" ? "kullanici" : "asistan"}`}>
      {mesaj.gorseller && mesaj.gorseller.length > 0 && (
        <div className="mesaj-gorselleri">
          {mesaj.gorseller.map((gorsel, i) => (
            <img
              key={i}
              src={`data:${gorsel.mediaType};base64,${gorsel.data}`}
              alt="Gönderilen görsel"
            />
          ))}
        </div>
      )}
      {mesaj.icerik && <div>{mesaj.icerik}</div>}
    </div>
  );
}
```

- [ ] **Step 3: `globals.css`'e görsel arayüzü stillerini ekle**

`ai-panel/app/globals.css` dosyasının SONUNA ekle:

```css
/* --- Görsel yükleme --- */

.gorsel-ekle-buton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  background: var(--kart);
  border: 1px solid var(--cizgi);
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
}

.gorsel-ekle-buton input {
  display: none;
}

.gorsel-onizleme-seridi {
  display: flex;
  gap: 8px;
  padding: 0 14px 10px;
  overflow-x: auto;
}

.gorsel-onizleme {
  position: relative;
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--cizgi);
}

.gorsel-onizleme img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gorsel-kaldir-buton {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mesaj-gorselleri {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}

.mesaj-gorselleri img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
}
```

- [ ] **Step 4: Tip kontrolü ve build**

```bash
cd ai-panel
npx tsc --noEmit
npm run build
```

Beklenen: ikisi de hatasız biter.

- [ ] **Step 5: Manuel doğrulama — gerçek tarayıcıda dene**

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` adresine git, giriş yap (`test`/`test1234`). Sırayla dene:

1. 📎 butonuna tıkla, bilgisayarındaki gerçek bir resim dosyası seç — önizleme şeridinde küçük resim belirmeli.
2. Önizlemedeki "×" butonuna tıkla — görsel kaldırılmalı.
3. Tekrar bir görsel seç, 4'e ulaşana kadar 3 tane daha ekle — 📎 butonu 4'te devre dışı kalmalı (input disabled).
4. Metin yazmadan sadece görselle "Gönder"e bas — buton aktif olmalı (metin zorunlu değil), istek gönderilmeli (yerel `.env.local`'de gerçek `ANTHROPIC_API_KEY` yoksa sunucu hatası dönebilir, bu normal — burada kontrol edilen istemci davranışı: görsel + boş metinle gönderim engellenmiyor).
5. Tarayıcı geliştirici araçlarında Network sekmesinden `/api/chat` isteğinin gövdesinde `gorseller` alanının base64 veri içerdiğini doğrula.
6. Cihaz görünümünü 375px yap — 📎 butonu ve önizleme şeridi taşmadan sığmalı.

- [ ] **Step 6: Commit**

```bash
cd ..
git add ai-panel/components/SohbetEkrani.tsx ai-panel/components/MesajBalonu.tsx ai-panel/app/globals.css
git commit -m "ai-panel: sohbet arayuzune gorsel yukleme (secici + kucultme + onizleme + gosterim)"
```

---

### Task 5: Canlıya Alma ve Uçtan Uca Doğrulama

**Files:**
- Yok (sadece push + canlı doğrulama)

**Interfaces:**
- Consumes: Task 1-4'ün tüm çıktıları
- Produces: özellik canlıda (Vercel production) çalışır durumda

- [ ] **Step 1: Son bir kez tam test + build**

```bash
cd ai-panel
npm test
npx tsc --noEmit
npm run build
```

Beklenen: 36 test PASS, tip hatası yok, build temiz.

- [ ] **Step 2: Push et**

```bash
cd ..
git push origin master
```

Bu, Vercel'de otomatik yeni bir production deploy tetikler.

- [ ] **Step 3: Deploy'un bitmesini bekle**

Vercel dashboard'da **Deployments** sekmesinden son deploy'un "Ready" durumuna gelmesini bekle (genelde 1-2 dakika). Build loglarında hata olmadığını doğrula.

- [ ] **Step 4: Canlıda uçtan uca doğrulama**

Canlı URL'ye git, giriş yap. Bir hesap/mod seç, 📎 ile gerçek bir ekran görüntüsü (örn. herhangi bir uygulama ekran görüntüsü) seç, isteğe bağlı kısa bir metinle ("bu görselde ne görüyorsun?") birlikte gönder.

**Beklenen:** Claude'un cevabı, gönderilen görselin gerçek içeriğini tarif etmeli (örn. ekrandaki metni, düzeni, renkleri anlatması) — bu, görselin base64 olarak doğru şekilde Claude API'ye ulaştığının ve modelin onu gerçekten işlediğinin kanıtı.

- [ ] **Step 5: `/kullanim` sayfasında yeni isteğin göründüğünü doğrula**

Canlı `/kullanim` sayfasına git — bir önceki adımdaki istek, istek sayısına ve maliyete yansımış olmalı.

---

## Uygulamadan Sonra

Görsel yükleme özelliği tamamlandığında CLAUDE.md'nin "mobilde ekran görüntüsü" akışı artık AI Paneli üzerinden de çalışır hale gelir — kullanıcı Instagram Insights ekranlarını (Overview, Paylaştığın içerikler, Takipçi grafiği, Profil etkinliği) tek mesajda gönderip analiz isteyebilir.
