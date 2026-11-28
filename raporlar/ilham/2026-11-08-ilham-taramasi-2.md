# İlham Taraması — 2026-11-08 (Efe isteğiyle, PC açık)

**Hesap:** @fuegorestaurantcafe için
**Taranan:** Kaydedilenler (42 gönderi, son eklenenler), Keşfet (ilk ~20 kare). Chrome ile sadece okundu, hiçbir etkileşim yapılmadı.
**Kaydedilenler'in genel resmi:** Ağırlık burger, pizza, kafe/pastane ve Asya mutfağı. Fuego'nun mutfağına birebir uyan az; ama **format** olarak çok işe yarayanlar var. Keşfet'te ise çoğunluk kişi/ekip odaklı içerik (Efe istemiyor) ve "Kasım içerik fikirleri" tipi ajans postları, elendi.

## Seçilen 4 kart

| # | Kaynak | Format | Performans | Higgsfield ihtiyacı | Puan |
|---|---|---|---|---|---|
| 1 | @osteriarenata "Service Please." | Üstten tezgâh + adisyon, sipariş hazırlanıyor | 5,1B beğeni, 6,2B paylaşım | Az (asıl gerçek çekim) | 9/10 |
| 2 | @thelazyguycafe "The reason vs the real reason" | İkiye bölünmüş ekran: "what you come for / why you stay" | 6,4B paylaşım | Orta | 8/10 |
| 3 | @melty.ru (Keşfet) | Yemek makro dokusu üstünde beyaz menü kartı, carousel | 567 beğeni | Yüksek (arka plan dokusu) | 8/10 |
| 4 | @seraser_restaurant (Sultanahmet komşu) | Bahçe fotoğrafı üstünde "Letter from you" zarfı, misafir yorumları carousel | 49 beğeni | Orta | 6/10 |

---

### Kart 1 — "Service Please": üstten adisyon kurgusu · @osteriarenata · reels · 27 Eylül
Link: https://www.instagram.com/p/DdyBzeiDs24/
Performans: 5,1B beğeni · 14 yorum · 58 repost · 6,2B paylaşım (paylaşım beğeniden fazla, yani insanlar birine "bak" diye atıyor)

**Ne görünüyor:** Kamera paslanmaz çelik servis tezgâhına tam yukarıdan bakıyor, sabit. Sağda restoranın adisyonu duruyor (masa no, 3 kalem). Eller sırayla adisyondaki yemekleri tabağa koyup kadrajdan çıkarıyor. Hızlı kesmeli, orijinal ses (mutfak sesi). Sonunda "Service please".

**Neden işe yaramış:** Adisyon izleyene "bu masanın siparişi" hikâyesini veriyor; her tabakta "sıradaki ne" merakı var. Mutfak arkası gerçek ve samimi, yüz yok.

**Fuego uyarlaması:** Turist masasının tipik siparişi: "TABLE 7 · Mezze plate · Testi kebab · Künefe · 2 Turkish tea". Fuego adisyonu tezgâhta, tabaklar sırayla geliyor. Testi kebabı, kırmadan önce ve sonra iki ayrı an olarak girebilir.

**Girdi:** Bu iş gerçek çekimle yapılır, Higgsfield sadece destek. Telefon tezgâhın üstüne sabitlenir (raf/tripod), 9:16, 1 servis boyunca kayıt. Gerçek bir Fuego adisyonu (müşteri bilgisi olmadan).

**Higgsfield (opsiyonel, kapanış karesi için):** Tezgâhta hazır tüm tabakların üstten fotoğrafından 3 saniyelik "son kare" klibi.
- Model: `seedance_2_5` · image-to-video · `start_image` · `duration: 5` · `aspect_ratio: 9:16` · `generate_audio: false` (üretim öncesi `models_explore` ile teyit)

```
Top-down overhead shot of a stainless steel restaurant kitchen pass with finished Turkish dishes lined up and a paper order ticket on the right. The camera stays perfectly locked overhead. Gentle real steam rises from the hot plates, the ticket flutters very slightly. Keep every dish, plate and the ticket exactly as in the photo, no new food, no text changes. Cool kitchen light with warm food tones, real-footage feel, 9:16 vertical. No faces, no people entering the frame, no logos added.
```

**Caption:** `Table 7, service please. 🔥 Mezze, testi kebab, künefe and Turkish tea in Sultanahmet.`
**Ses:** Orijinal mutfak sesi (zil, tabak, "service!").

---

### Kart 2 — "What you come for / why you stay" · @thelazyguycafe · reels · 26 Ağustos
Link: https://www.instagram.com/p/DcgEAKpzbBV/
Performans: 18 yorum · 91 repost · 6,4B paylaşım

**Ne görünüyor:** Ekran ikiye bölünmüş. Sağda "what you come for": tabaktaki yemek, elde servis. Solda "why you stay": mutfaktaki ekip, gülümseyen garson. İki taraf aynı anda akıyor, büyük beyaz el yazısı başlık.

**Neden işe yaramış:** "Yemeğe geldin, atmosfer için kaldın" duygusu. Kısa, döngüye uygun, paylaşılabilir.

**Fuego uyarlaması (ekip yüzü olmadan):** Sağ "what you come for": testi kebabı kırılışı / Ali Nazik. Sol "why you stay": teraslı akşam, çay bardağında buhar, Sultanahmet sokağından masaya bakış. Kişi gerekirse sadece eller.

**Girdi:** Sağ taraf için mevcut testi videosu ("We set your dinner on fire" ham çekimi). Sol taraf için mekân/teras fotoğrafı + Higgsfield ile hareket.

**Higgsfield (sol taraf):**
- Model: `kling3_0` · image-to-video · `start_image` = Fuego terası/masa, akşam · `duration: 5` · `aspect_ratio: 9:16` · ses kapalı

```
Evening on a cozy restaurant terrace in Istanbul's old town, a glass of Turkish tea on the table in the foreground with thin steam rising. Camera slowly pushes in toward the tea glass, very steady. Warm string lights softly bokeh in the background, a slight breeze moves the tablecloth. Keep the terrace, tables and street exactly as in the photo, same evening light. No people's faces, no new buildings, no mosques or minarets added, no text. Real-footage feel, 9:16 vertical.
```

**Kurgu (CapCut):** İki klip yan yana, üstte "what you come for" / "why you stay" beyaz el yazısı.
**Caption:** `The reason vs the real reason. ❤️ Sultanahmet, Istanbul.`

---

### Kart 3 — Makro doku üstünde menü kartı · @melty.ru · carousel · 22 Ekim (Keşfet)
Link: https://www.instagram.com/p/Dey_cDxgBVE/
Performans: 567 beğeni

**Ne görünüyor:** Arka plan yemeğin malzemelerinin aşırı yakın çekimi (doku). Ortada beyaz, sade bir menü kartı: üstte marka adı ve kategori, ortada tabağın temiz stüdyo fotoğrafı, altta yemeğin adı ve kısa tarif. Her slaytta bir yemek.

**Neden işe yaramış:** Menüyü reklam gibi değil, dergi sayfası gibi gösteriyor. Kaydedilir; turist "ne yiyeceğim" diye bakıyor.

**Fuego uyarlaması:** Arşivdeki **stüdyo menü serisi (01-08)** zaten bu kartın ortası için hazır. Arka plan dokusu Higgsfield ile üretilir (Fuego'nun kendi yemeğinin makro dokusu): Ali Nazik için közlenmiş patlıcan + yoğurt, testi için toprak testi yüzeyi + közde domates, künefe için tel kadayıf + fıstık. Kart Fuego bordo (#7A2418) yazı + kırık beyaz (#F7F8F4) zemin.

**Higgsfield (arka plan görseli, her yemek için 1 adet):**
- Model: `gpt_image_2_6` (ya da `models_explore` önerisi) · referans = ilgili Fuego stüdyo fotoğrafı · `aspect_ratio: 4:5`

```
Extreme macro close-up food texture filling the entire frame, the same ingredients as the reference dish: smoky charred eggplant puree swirled with thick white yogurt, glossy butter and red pepper flakes. Shot from directly above, natural soft daylight, rich true-to-life colours, shallow depth of field. No plate edges, no cutlery, no text, no hands, no logos. 4:5.
```

**Kurgu (Canva/CapCut):** Arka plan + ortada kırık beyaz kart + stüdyo fotoğrafı + "FUEGO · OTTOMAN CLASSICS" + yemek adı + 1 satır İngilizce tarif.
**Caption:** `Our Ottoman classics, one by one. Which one are you ordering first? 👇`

---

### Kart 4 — "Letter from you": misafir yorumu zarfı · @seraser_restaurant · carousel · 18 Eylül
Link: https://www.instagram.com/p/DdbR2G6CLfD/
Performans: 49 beğeni (düşük, ama Sultanahmet'teki komşu Osmanlı restoranı ve Efe kaydetmiş)

**Ne görünüyor:** İlk slayt: restoranın bahçe fotoğrafı üstünde krem renkli zarf, üstünde "Letter from you!" el yazısı. Diğer slaytlar: misafir yorumları mektup gibi.

**Fuego uyarlaması:** Reviews highlight'ı hâlâ eksik. Google/Tripadvisor yorumlarından 4-5 tanesi "Letter from Rome / from Texas / from Seoul" gibi ülke başlıklı mektuplara dönüşür (turist kitlesi için güçlü).

**Higgsfield (sadece kapak):**
- Model: `gpt_image_2_6` · referans = Fuego teras/salon fotoğrafı · `aspect_ratio: 4:5`

```
Keep the restaurant photo exactly as it is. Add a single cream-coloured paper envelope floating in the center with a soft natural shadow, handwritten dark burgundy script on it reading "Letters from our guests". Realistic paper texture, slight tilt. Nothing else changed, no extra objects, no other text. 4:5.
```

**Not:** Yorum metinleri gerçek ve isimsiz (sadece şehir/ülke) kullanılmalı.

---

## Önerim

En güçlüsü **Kart 1**. Higgsfield'a neredeyse hiç kredi gerekmiyor, sadece bir akşam servisinde telefonu tezgâhın üstüne sabitlemek yeterli. Hızlı ve ucuz olan **Kart 3**: elimizdeki stüdyo menü serisiyle 8 slaytlık bir carousel. Higgsfield'da 8 arka plan görseli üretilir ama önce 1 tanesi denenir.

## Takip listesine eklenecek aday

- @osteriarenata (mutfak arkası formatı güçlü) — 1. kez çıktı, bir kez daha iyi içerik çıkarsa listeye girer.
