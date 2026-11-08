# Unreels (unreels.app) — Araç Değerlendirmesi + Higgsfield'a Uyarlanan Kalıplar

**Tarih:** 2026-11-08
**Yöntem:** REA MCP ile kontrollü tarayıcı senaryoları. Okunan sayfalar: ana sayfa, `/templates` (tüm katalog, ~450 şablon), `/pricing` ve 14 şablonun detay sayfası. Restorana uyan 5 şablonun önizleme videosu oynatılıp kare kare ekran görüntüsü alındı (dosya indirilmedi). Hesap açılmadı, iPhone uygulaması denenmedi.

## Ne vaat ediyor?

StoryPath Apps Ltd'nin **tüketici odaklı AI efekt ve Reels şablon uygulaması**. Ana vaadi "Fotoğrafın neye dönüşecek?". Katalogun büyük kısmı selfie, evcil hayvan, araba, anime/heykel stili, Cadılar Bayramı ve yılbaşı efektleri. **Restorana özel bir bölüm yok.** Restorana uyan kısım iki grup:

| Tür | Nasıl çalışıyor | Restorana uyan örnekler |
|---|---|---|
| **AI efektleri (web + iPhone)** | 1-5 fotoğraf yüklüyorsun, AI kamera hareketli bir video üretiyor | 3D orbit (burger örneğiyle), Fly-Through, Day to Night, Into the Spotlight, Orbit + Fly-Through + Pan |
| **Kurgu şablonları (sadece iPhone)** | Kendi fotoğraf ve kliplerini hazır müzik, kesim ve yazıya yerleştiriyorsun. AI yok | `food_01` "Miami", `food_03` "Desserts", `food_04` "Woow", `food_07` "YUM YUM", `food_08` "Amour", `food_10` "River Lume" (3-8 sn), yılbaşı serisi `newyear_*` |

**Fiyat:** Kredi sistemi. PRO haftalık/yıllık planda haftada 260 kredi, MAX'ta ayda 1.999 kredi. Kredi sadece iPhone uygulamasından alınabiliyor; TL/$ fiyatı web'de yazmıyor. Efekt başına maliyet: 3D orbit 230, Fly-Through 100-105, Day to Night 115, Spotlight 275, 5'li combo 655 kredi. **PRO planla haftada ancak 1-2 video çıkar.**

**Promptlar gizli.** Sitede şablonun promptu yok; sadece adı, açıklaması, kaç fotoğraf istediği ve önizleme videosu var. Aşağıdaki kalıplar, önizlemelerdeki kamera hareketini izleyip Higgsfield'a yeniden yazdığım promptlardır.

## Sonuç: Unreels'e abone olmaya gerek yok

- AI efektlerinin hepsini zaten sahip olduğumuz **Higgsfield** ile yapabiliyoruz. Kontrol de bizde (prompt, süre, çözünürlük).
- Kurgu şablonları da yalnızca müzik, kesim ve yazı. Aynısı **CapCut**'ta yapılır.
- Değeri **fikir kataloğu** olarak: Hangi kamera hareketinin yemekte işe yaradığını gösteriyor. Aşağıda bunu Fuego'ya uyarladım.

## Fuego kuralları (her kalıpta geçerli)

- **Ana malzeme gerçek Fuego çekimi** (`icerikler/fuego-restaurant-instagram/cekimler/`). AI sadece kamera hareketi ekler, sahneyi değiştirmez.
- **Tek videoda tek zaman dilimi.** Gece ve gündüz karışmaz.
- AI çıktısında **arka plana cami/minare eklenmişse kullanılmaz.**
- Prompta masadaki **boş veya ters kapatılmış tabak/bardakların kaldırılması** açıkça yazılır.
- **Üretim tek tek yapılır:** önce öneri kartı (girdi foto + prompt + maliyet), onay gelirse sadece o video.

## Higgsfield'a uyarlanan kalıplar

Higgsfield'da teyit edildi (2026-11-08): `seedance_2_5` ve `kling3_0` ikisi de `start_image` + `end_image` alıyor. Kredi maliyeti her üretimden önce sorgulanıp söylenecek.

### K1 — 3D Orbit: İmza tabak (Unreels "3D orbit", 230 kredi)
**Önizlemede ne var:** Koyu ahşap masa, burger + patates. Kamera tabağın etrafında yavaşça ~30-40° dönüyor, arka plan sıcak ve bulanık. 4-5 sn.
**Fuego girdisi:** Testi kebabı ya da imza tabağın, masada, gün ışığında çekilmiş tek bir net fotoğrafı.
**Model:** `seedance_2_5` · `mode: omni_reference` · girdi = `start_image` · `duration: 5` · `resolution: 1080p` · `aspect_ratio: 9:16` · `generate_audio: false`

```
Slow cinematic orbit around the plate on the table, camera arcs 40 degrees to the right at table height, smooth and steady like a motion-control rig. The dish stays exactly as in the photo: same food, same plate, same garnish, no new items. Gentle real steam rising from the hot food. Shallow depth of field, background softly blurred, same daylight and colour as the photo. Remove any empty or upside-down plates and glasses from the table. No people, no text, no added decorations, no buildings or skyline in the background.
```

### K2 — Fly-Through: Kapıdan masaya (Unreels "Fly-Through", 2 foto, 105 kredi)
**Önizlemede ne var:** Evin dış cephesi → kamera ön kapıya doğru uçuyor → kapıdan geçip iç salonda bitiyor. Tek kesintisiz drone hareketi, ~5 sn.
**Fuego girdisi:** (1) Restoranın girişi veya terası, sokaktan, **gündüz**. (2) İçeride kurulu bir masa ya da salon, **aynı gün ışığında**.
**Model:** `kling3_0` · `mode: pro` · foto 1 = `start_image`, foto 2 = `end_image` · `duration: 5` · `aspect_ratio: 9:16` · `sound: off`

```
One continuous FPV drone shot: the camera starts on the restaurant entrance from the street, glides forward through the open door and flies into the dining room, slowing down and settling on the set table of the last frame. Smooth, steady, real-footage feel. Keep the building, signage and interior exactly as in the photos. Same daylight throughout. No people appearing, no added objects, no minarets or skyline added.
```

### K3 — Spotlight Reveal: Karanlıkta ışık tabağı buluyor (Unreels "Into the Spotlight", 275 kredi)
**Önizlemede ne var:** Karanlık stüdyoda üç ürün. Bir spot ışığı sahnede geziniyor ve ortadakinin üstünde durup onu aydınlatıyor. ~5 sn.
**Fuego girdisi:** İmza tabak, koyu zemin/masa üstünde, net fotoğraf. Tek tabak olması yeterli.
**Model:** `seedance_2_5` · `mode: omni_reference` · girdi = `start_image` · `duration: 5` · `resolution: 1080p` · `aspect_ratio: 9:16` · `generate_audio: false`

```
The scene starts almost completely dark, only the outline of the plate visible. A single warm spotlight beam slowly sweeps across the dark table and stops on the dish, lighting it up beautifully; steam catches the light. The food, plate and garnish stay exactly as in the photo. Slight slow push-in toward the dish at the end. No text, no extra plates or glasses, no people.
```

**Not:** Bu kalıp stüdyo havası taşır. Restoranın gerçek ortamıyla aynı filmde kullanılmaz; tek başına kısa bir reels/story olarak kullanılır.

### K4 — Mekân turu: Orbit + Fly-Through + Pan (Unreels combo, 5 foto, 655 kredi)
**Önizlemede ne var:** 5 fotoğraf tek klipte birleşiyor: ana objeye orbit → bir sahneden diğerine uçuş → yatay pan → final orbit.
**Higgsfield'da:** Tek seferde değil, **K2 tipi 2-3 ayrı Kling start/end klibi** üretilir ve CapCut'ta arka arkaya eklenir. Örnek sıra: giriş → salon, salon → teras, teras → imza tabak. Önce ilk klip üretilip gösterilir, beğenilirse devam edilir. Tüm fotoğraflar aynı zaman diliminden olmalı.

### K5 — Hızlı kesmeli tatlı/yemek kurgusu (Unreels "Desserts", iPhone, AI yok)
**Önizlemede ne var:** Üstte sabit büyük başlık ("Desserts"). Her biri ~1,3 sn süren 3 farklı yemek karesi ritme göre kesiliyor; karelerde düşen kakao/pudra tozu gibi hareket var. Toplam ~4 sn.
**Fuego'da:** Higgsfield gerekmez, kredi harcanmaz. CapCut'ta 3-5 gerçek çekim (ör. künefe üstüne fıstık serpme, çay dökme, tatlı tabağı) + tek kelimelik başlık ("Sweet Endings" / "Dessert Time") + trend ses. Gerçek "serpme/dökme" anları telefonla çekilmeli.

### Önerilmeyenler
- **Day to Night (115 kredi):** Teras fotoğrafı tek klipte gündüzden geceye dönüyor. Fuego kuralına ("tek videoda gece/gündüz karışmasın") ters düşüyor. Ayrıca AI'ın gökyüzüne cami/minare ekleme riski yüksek. Ancak kullanıcı bilinçli olarak isterse denenebilir.
- **Background Shift, Blue Hour, Glass Slice, logo animasyonları:** Ürün veya kişi odaklı ya da "AI olduğu belli" efektler. Gerçekçi Fuego çizgisine uymuyor.
- **Yılbaşı kurgu şablonları (`newyear_*`):** Aralık için fikir olarak not edildi. Aynı mantık CapCut'ta gerçek çekimlerle kurulur.

## Önerilen ilk adım

En düşük riskli ve gerçeğe en yakın kalıp **K1 (3D Orbit)**. Tek gerçek fotoğraf yetiyor ve sahne değişmiyor. Akış:
1. `cekimler/` içinden testi kebabı ya da imza tabak fotoğrafı seçilir.
2. Öneri kartı hazırlanır: girdi foto + yukarıdaki prompt + Higgsfield'dan sorgulanan kredi maliyeti.
3. Onay gelirse tek bir 5 sn video üretilir ve gösterilir.
