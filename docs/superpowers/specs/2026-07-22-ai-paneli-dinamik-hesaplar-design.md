# AI Paneli: Dinamik Hesap Seçici — Tasarım

**Tarih:** 2026-07-22
**Durum:** Onaylandı

## Problem

AI Paneli'nin sohbet arayüzünde hesap seçici (`HesapModSecici`), `lib/modTanimlari.ts` içindeki sabit 4 kayıtlık `HESAPLAR` dizisinden besleniyor: `sahsi`, `restoran`, `youtube`, `maps`. Her biri jenerik bir etiketle görünüyor ("Şahsi Instagram", "Restoran Instagram" vb.), gerçek hesap adı hiçbir yerde gösterilmiyor.

`/profil-ekle` komutu ise `profiller/` klasörüne serbest isimli yeni profil dosyaları ekleyebiliyor (örn. arkadaş/müşteri hesapları için `lezzetduragi-restoran.md`), ama panel bu yeni dosyaları hiç görmüyor — kod değişikliği + deploy olmadan listeye giremiyorlar.

Kullanıcının isteği: hesap seçicide gerçek hesap adı görünsün (örn. `@egenisankoc`, `fuegorestaurant`) ve `profiller/` klasörüne her yeni hesap eklendiğinde panel otomatik olarak onu listeye alsın — kod değişikliği gerekmesin.

## Çözüm Özeti

`profiller/*.md` klasörü hesap listesi için tek gerçek kaynak olur. Panel her sayfa yüklendiğinde bu klasörü GitHub Contents API üzerinden tarar, her dosyanın içeriğinden gerçek hesap adını çıkarır ve seçiciyi buna göre kurar. Sabit `HESAPLAR` dizisi kaldırılır.

## Bileşenler

### 1. `ai-panel/lib/github.ts` — `dizinListele`

Yeni fonksiyon:

```ts
export async function dizinListele(yol: string): Promise<string[]>
```

`octokit.repos.getContent({ path: yol })` bir dizin için dosya adı listesi (dizi) döner; bu fonksiyon `.md` uzantılı dosyaların tam yollarını (`profiller/xxx.md`) döner. Dizin yoksa (404) boş dizi döner — `dosyaOku`'daki 404 kuralıyla tutarlı. 404 dışındaki hatalar yeniden fırlatılır.

### 2. `ai-panel/lib/hesaplariGetir.ts` — yeni, sunucu-taraflı

```ts
export async function hesaplariGetir(): Promise<HesapTanimi[]>
```

`HesapTanimi` arayüzü (`{ id, ad, profilDosyasi }`) `lib/modTanimlari.ts`'ten değişmeden kalır ve buradan import edilir — sadece veri kaynağı statikten dinamiğe geçiyor.

Akış:
1. `dizinListele("profiller")` ile tüm `.md` dosyalarının yolu alınır.
2. Her dosya `dosyaOku` ile okunur.
3. İçerikten hesap adı çıkarılır (bkz. Parse Mantığı).
4. `id` = dosya adı, uzantısız (örn. `restoran-instagram`, `lezzetduragi-restoran`) — GitHub'da benzersiz olduğu için stabil bir kimlik.
5. Tekil dosya okuma hatası olursa (örn. ağ hatası) o dosya atlanır, diğerleri döner — tek bir bozuk dosya tüm listeyi düşürmez.

### Parse Mantığı (hesap adı çıkarma)

Markdown içinde `- **<Etiket>:** <Değer>` biçimindeki satırlar taranır. Öncelik sırası:

1. Etiketi `"Kullanıcı adı"` içeren satır (hem `sahsi-instagram.md`'deki `Kullanıcı adı:` hem `restoran-instagram.md`'deki `Kullanıcı adı (Instagram):` ile eşleşir)
2. Yoksa etiketi `"İşletme adı"` içeren satır
3. Yoksa etiketi `"Kanal adı"` içeren satır

Bulunan değer `_(...)` kalıbıyla başlıyorsa (henüz doldurulmamış placeholder) doldurulmamış sayılır. Hiçbir alan dolu değilse: dosya adından türetilmiş başlık (örn. `restoran-instagram` → `Restoran Instagram`) + `" (profil eksik)"` son eki gösterilir — bugünkü boş `restoran-instagram.md` durumunda tam olarak bunu üretir, yani görünür bir gerileme olmaz. Kullanıcı profili doldurunca (örn. `fuegorestaurant` yazınca) bir sonraki sayfa yüklemesinde otomatik gerçek adına döner.

### 3. `ai-panel/app/page.tsx`

Server Component olarak kalır; `hesaplariGetir()` render sırasında çağrılır, sonuç `SohbetEkrani`'ye `hesaplar` prop'u olarak geçirilir.

### 4. `ai-panel/components/SohbetEkrani.tsx`

- Yeni prop: `hesaplar: HesapTanimi[]`
- `seciliHesap` state'inin başlangıç değeri artık sabit `"restoran"` değil, `hesaplar[0]?.id ?? ""`
- `hesaplar` prop'u `HesapModSecici`'ye geçilir

### 5. `ai-panel/components/HesapModSecici.tsx`

Sabit `HESAPLAR` importu kaldırılır; `hesaplar: HesapTanimi[]` prop olarak alınır, dropdown ondan kurulur. `MODLAR` importu değişmeden kalır (mod listesi zaten sabit ve doğru çalışıyor, bu tasarımın kapsamı dışında).

### 6. `ai-panel/lib/sistemTalimati.ts`

`hesabiBul(hesapId)` çağrısı yerine `hesaplariGetir()` çağrılıp sonuç içinde `id` eşleşmesi aranır (`.find()`). `modTanimlari.ts`'teki eski `hesabiBul`/`HESAPLAR` kaldırılır (artık kullanılmıyor).

## Hata Durumları

- `profiller/` klasörü hiç yoksa: dropdown boş gelir, uygulama çökmez.
- Tek bir profil dosyası okunamazsa: o hesap listeden atlanır, diğerleri gösterilir.
- GitHub API'ye erişilemezse (auth hatası vb.): mevcut `dosyaOku`/`dosyaYaz` davranışıyla tutarlı şekilde hata yukarı fırlatılır, Next.js'in mevcut hata sınırı bunu yakalar (yeni bir hata yönetimi eklenmez).

## Test Planı

- `hesaplariGetir` için birim testi (`lib/hesaplariGetir.test.ts`): dolu "Kullanıcı adı" alanı, dolu "İşletme adı" alanı (Kullanıcı adı yokken), placeholder/boş alan → "(profil eksik)" fallback, dizin boşsa boş dizi, tekil dosya hatasında diğerlerinin döndüğü senaryo.
- `dizinListele` için birim testi (`lib/github.test.ts`'e ekleme): dizin var/yok senaryoları.
- UI değişiklikleri (`SohbetEkrani`, `HesapModSecici`, `page.tsx`) için otomatik test yazılmaz — mevcut projede de route/UI katmanı `npm run dev` + tarayıcı ile manuel doğrulanıyor (Task 9/10 emsaliyle tutarlı).

## Kapsam Dışı

- Hesap tipine göre ikon/rozet gösterimi (kullanıcı sadece gerçek adı istedi, tip etiketi istemedi).
- `profiller/` dışı bir depolama/veritabanı değişikliği.
- Caching/performans optimizasyonu (3-5 kullanıcılık düşük trafik için gereksiz — YAGNI).
