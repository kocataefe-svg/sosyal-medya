# AI Paneli — Görsel (Ekran Görüntüsü) Yükleme Tasarımı

Tarih: 2026-07-21

## Problem

`CLAUDE.md`'nin veri erişimi bölümü, Instagram Insights gibi sadece hesap sahibine görünen verinin mobilde tek erişim yolunun ekran görüntüsü paylaşımı olduğunu tarif ediyor. AI Paneli'nin sohbet kutusu şu an sadece metin kabul ediyor — bu akış panelde çalışmıyor. Kullanıcı, kredi kartı/Pro abonelik gerektirmeyen bu paneli tam bağımsız kullanabilmek için görsel yükleme istiyor.

## Kullanıcıyla Netleşen Kararlar

- **Çoklu görsel:** Bir mesajda en fazla 4 görsel gönderilebilir (CLAUDE.md'nin Insights akışı tek analiz için 4 farklı ekran istiyor: Overview, Paylaştığın içerikler, Takipçi grafiği, Profil etkinliği).
- **İstemci tarafı sıkıştırma:** Zorunlu. Vercel Hobby planında istek gövdesi sınırı (~4.5MB) var; 4 ham telefon ekran görüntüsü (2-5MB/tane) bunu kolayca aşar. Tarayıcıda canvas ile küçültülüp gönderilecek.

## Yaklaşımlar

### Yaklaşım A: İstemci tarafı resize + base64 JSON (Önerilen)

Görseller seçildiğinde tarayıcıda (canvas API ile) uzun kenar ~1568px'e indirilir, JPEG'e sıkıştırılır, base64 olarak mevcut JSON tabanlı `/api/chat` isteğine eklenir.

**Trade-off'lar:**
- (+) Mevcut basit JSON API sözleşmesi bozulmaz, sunucu tarafı minimal değişir
- (+) Ek native/npm bağımlılık gerekmez (canvas tarayıcı yerlisi)
- (+) Sıkıştırma yükleme anında olur, sunucuya asla ham/büyük dosya gitmez — boyut sınırına takılma riski kalkar
- (−) Resize mantığı tarayıcıya özgü (canvas/Image/FileReader) — `lib/` katmanında saf fonksiyon olarak test edilemez, sadece manuel/derleme zamanı doğrulanabilir

### Yaklaşım B: multipart/form-data + sunucu tarafı resize (örn. `sharp`)

Dosyalar olduğu gibi yüklenir, Next.js API route'ta bir kütüphaneyle resize edilir.

**Trade-off'lar:**
- (−) Vercel serverless'ta native bağımlılıklar (sharp gibi) bazen build/uyumluluk sorunu çıkarır
- (−) Resize sunucuda olduğu için HAM dosya önce sunucuya ulaşmalı — istek boyutu sınırı riski hâlâ var (özellikle 4 görsel birden)
- (−) API route'un content-type işleme mantığı JSON'dan multipart'a değişir, mevcut mimariye daha invaziv
- (+) İstemci kodu daha basit kalır

**Seçim:** Yaklaşım A. Daha az invaziv, ek bağımlılık yok, asıl riski (istek boyutu) kaynağında çözüyor.

## Bileşenler

### 1. `lib/types.ts` — veri modeli genişletme

```ts
export interface SohbetGorseli {
  mediaType: "image/jpeg" | "image/png" | "image/webp";
  data: string; // base64, "data:" öneki OLMADAN
}

export interface SohbetMesaji {
  rol: "user" | "assistant";
  icerik: string;
  gorseller?: SohbetGorseli[];
}
```

`gorseller` opsiyonel — mevcut testler ve metin-only mesajlar bozulmaz.

### 2. `lib/gorselDogrula.ts` (yeni, saf mantık — TDD ile test edilir)

Tarayıcı API'sine bağımlı OLMAYAN, hem istemci hem sunucu tarafında kullanılabilecek doğrulama kuralları:

- `MAKSIMUM_GORSEL_SAYISI = 4`
- `GECERLI_MEDIA_TIPLERI = ["image/jpeg", "image/png", "image/webp"]`
- `gorselListesiGecerliMi(gorseller: SohbetGorseli[]): { gecerli: boolean; hata?: string }` — sayı ve tip sınırını kontrol eder

### 3. Görsel küçültme (component içinde, manuel doğrulanır — canvas'a bağımlı olduğu için `lib/`'e çıkarılamaz)

`components/SohbetEkrani.tsx` içinde `gorseliKucult(file: File): Promise<SohbetGorseli>`:
- `FileReader` + `Image` ile dosyayı yükler
- Uzun kenar 1568px'i aşıyorsa oranlı küçültür (canvas'a çizip yeniden boyutlandırır)
- `canvas.toDataURL("image/jpeg", 0.8)` ile sıkıştırır, `data:` önekini soyar
- HEIC/HEIF gibi tarayıcının çizemediği formatlarda hata fırlatır → kullanıcıya "bu görsel okunamadı, JPEG/PNG deneyin" mesajı gösterilir

### 4. `components/SohbetEkrani.tsx` — UI

- Mesaj formuna 📎 simgeli bir buton eklenir → `<input type="file" accept="image/*" multiple>` tetikler (mobilde native galeri/kamera seçici açılır)
- Seçilen görseller gönderilmeden önce küçük önizleme (thumbnail) şeridi olarak gösterilir, her birinin yanında "x" ile kaldırma
- `gorselListesiGecerliMi` ile sınır aşımı anında engellenir (örn. 5. görsel eklenmeye çalışılırsa)
- Gönder butonu: metin VEYA en az bir görsel varsa aktif (ikisi de boşsa pasif) — sadece görsel gönderme (yorumsuz "şu ekranları analiz et") desteklenir

### 5. `components/MesajBalonu.tsx` — geçmişte gösterim

Mesajda `gorseller` varsa, metnin üstünde/altında küçük resim önizlemeleri gösterilir (hem kullanıcı hem asistan mesajlarında — asistan görsel üretmiyor ama tip simetrik kalsın diye kontrol her iki tarafta da yapılır).

### 6. `app/api/chat/route.ts`

`SohbetIstegi.mesajlar` zaten genişletilmiş `SohbetMesaji[]` tipini kullanır. Ek olarak: gelen her mesajın `gorseller` alanı `gorselListesiGecerliMi` ile sunucu tarafında da doğrulanır (istemci doğrulamasını atlayan doğrudan API çağrılarına karşı savunma).

### 7. `lib/claude.ts` — Anthropic mesaj formatına çevirme

`sohbetIstegiGonder` içindeki mesaj eşleme mantığı:

```ts
const mesajGecmisi: Anthropic.MessageParam[] = params.mesajlar.map((m) => {
  if (!m.gorseller?.length) {
    return { role: m.rol, content: m.icerik }; // mevcut davranış, degismez
  }
  return {
    role: m.rol,
    content: [
      ...m.gorseller.map((g) => ({
        type: "image" as const,
        source: { type: "base64" as const, media_type: g.mediaType, data: g.data },
      })),
      { type: "text" as const, text: m.icerik },
    ],
  };
});
```

Görsel yoksa mevcut düz-string davranış korunur — geriye dönük uyumlu, mevcut `claude.test.ts` testleri bozulmaz.

## Sınır Durumları

- **Boş görsel + boş metin:** Gönder butonu zaten pasif, sorun olmaz.
- **5+ görsel seçimi:** `gorselListesiGecerliMi` istemci tarafında anında engeller, kullanıcıya "en fazla 4 görsel" mesajı.
- **Desteklenmeyen format (HEIC vb.):** Küçültme aşamasında yakalanır, o görsel eklenmez, hata gösterilir.
- **Sunucuya doğrudan (panel dışından) çok sayıda/geçersiz görsel gönderilirse:** `app/api/chat/route.ts` aynı doğrulamayı tekrarlar, 400 döner.

## Test Stratejisi (proje konvansiyonuna uygun)

- `lib/gorselDogrula.test.ts` — TDD, saf mantık (sayı/tip sınırı)
- `lib/claude.test.ts`'e yeni senaryo — görsel içeren mesajın doğru multi-block formata çevrildiğini doğrulayan test eklenir
- `components/SohbetEkrani.tsx` içindeki `gorseliKucult` (canvas) — manuel doğrulama: gerçek tarayıcıda (mobil + masaüstü) bir ekran görüntüsü seçip küçültülmüş halinin gönderildiğini, Claude'un görseli yorumladığını canlı ortamda test etme

## Açık Sorular

Yok — kullanıcıyla netleşmemiş karar kalmadı. Uygulamaya geçmeden önce bu dokümanın onayı isteniyor.
