# İlham Raporu — 2026-11-08 (ilk örnek)

**Hesap:** @fuegorestaurantcafe için
**Taranan:** @lokantalimu (17,7B takipçi), Chrome ile reels sekmesi. Sadece okundu, hiçbir etkileşim yapılmadı.
**Not:** Bu ilk deneme; ajanın çıktı formatını göstermek için tek hesaba bakıldı. Takip listesi genişleyince her rapor 3-5 kart içerecek.

## @lokantalimu reels sekmesinden gözlem

| İçerik | Görüntülenme | Takipçiye oran | Fuego'ya uyar mı |
|---|---|---|---|
| Şişte Acem kebabı, ızgaradan tabağa | 6.542 | 0,37x | **Evet**, ocakbaşı karşılığı birebir |
| Meze sofrası, yukarıdan geniş kadraj | 6.489 | 0,37x | **Evet**, meze + testi sofrası |
| İki kurucu terasta gün batımında | 36,6B | 2,1x | Hayır, Efe ekip/kişi içeriği istemiyor |
| Podcast kapağı (şef sohbeti) | 28,6B | 1,6x | Hayır, misafir şef/podcast formatı |
| "Pazar mutlu saatler" yazılı duyuru | — | — | Kısmen, metin postu fikri zaten profilde var |

En çok izlenen ikisi kişi odaklı olduğu için elendi. Yemek reels'leri takipçinin ~0,4 katında, yani hesabın sabit tabanı. Fuego'nun "We set your dinner on fire" reels'i 425 takipçiyle 468 görüntüleme (1,1x) almıştı; ocakbaşı formatı bizde onlardan daha iyi çalışıyor.

---

### Kart 1 — Közde şiş → tabakta ilk lokma · @lokantalimu · reels · 21 Ekim 2025
Link: https://www.instagram.com/reel/DQEsT6FjBnr/
Performans: 6.542 görüntülenme / 17,7B takipçi (0,37x) · 48 beğeni
Caption: "Acem Kebabı ve Acem Pilavı… Limu'nun ağır başlısı :)" + videografer etiketi

**Ne görünüyor:**
- 0-2 sn: Izgara üstünde, kömür közünde kızaran şişler; çok yakın, alçak açı, sığ alan derinliği. Duman ve kor parıltısı.
- 2-5 sn: Kesme, beyaz tabakta servis edilmiş kebap.
- Son: Bir el çatalla şişten eti çekiyor (yüz yok, sadece el).

**Neden işe yaramış:** İlk karede ateş + et var, kaydırmayı durduruyor. Kurgu "ızgaradan tabağa" diye basit bir hikâye anlatıyor. Yüz yok, sadece el olduğu için izleyen kendini masada hayal ediyor.

**Fuego uyarlaması:** Fuego'nun ocakbaşı kebabı (ya da Ali Nazik'in eti). Fuego'da zaten ateş kimliği var ("We set your dinner on fire"). Bu format ona "közden tabağa" devamı olur.

**Girdi:** PC arşivindeki ocakbaşı videolarından (`IMG_8231` / `IMG_8232`, orijinaller; sarı filtreli `IMG_E` kopyaları değil) net bir kare. Yoksa telefonla 10 saniyelik çekim: ızgaradaki şişler, alçak açı, yan ışık.

**Higgsfield:**
- Model: `seedance_2_5` · image-to-video · `start_image` = ocakbaşı karesi · `duration: 5` · `aspect_ratio: 9:16` · `resolution: 1080p` · `generate_audio: false` (model ve kredi üretim öncesi `models_explore` ile teyit edilecek)
- **Kamera:** Izgara yüksekliğinde çok yavaş yatay kayma, sonunda hafif yaklaşma.
- **Özne:** Fotoğraftaki şişler ve kömür, aynen.
- **Görünüm:** Sıcak turuncu kor ışığı, koyu arka plan, sığ alan derinliği, gerçek çekim hissi.
- **Aksiyon:** Etten yağ damlıyor, kordan kıvılcım ve duman yükseliyor.

```
Extreme close-up of lamb kebab skewers sizzling on a charcoal grill, camera at grill height slowly sliding sideways and gently pushing in at the end. Glowing embers under the meat, small sparks and real smoke rising, fat dripping and hissing on the coals. Keep the skewers, meat and grill exactly as in the photo, no new food added. Warm orange ember light, dark background, shallow depth of field, real handheld-footage feel, 9:16 vertical. No people, no text, no logos, no buildings or skyline.
```

**Kurgu (CapCut):** Higgsfield klibi (5 sn) → gerçek tabak çekimi, elle ilk lokma (3 sn) → Fuego logolu kapanış kartı (1 sn).
**Caption önerisi:** `From the coals to your table. 🔥 Ocakbaşı kebab, Sultanahmet. Reserve via link in bio.`
**Ses:** Gerçek cızırtı sesi + düşük seviyede trend enstrümantal.
**Uygunluk:** 9/10

---

### Kart 2 — Meze sofrası, yukarıdan · @lokantalimu · reels
Performans: 6.489 görüntülenme (0,37x)

**Ne görünüyor:** Beyaz örtülü masada 8-10 küçük meze tabağı, rakı bardağı. Kamera masanın üstünde yavaşça kayıyor.

**Neden işe yaramış:** Bolluk hissi veriyor, "kaç kişi gidelim" diye kaydedilip paylaşılıyor.

**Fuego uyarlaması:** Testi kebabı ortada, etrafında mezeler (turistin "Turkish feast" araması için).

**Girdi:** Gün ışığında, kurulmuş tam bir Fuego sofrası, yukarıdan (kuş bakışı) tek fotoğraf. Arşivde yoksa çekilecek.

**Higgsfield:**
- Model: `kling3_0` · image-to-video · `start_image` · `duration: 5` · `aspect_ratio: 9:16`

```
Top-down overhead shot of a full Turkish feast table: a clay testi kebab pot in the center surrounded by small meze plates. Camera glides slowly across the table from left to right, perfectly steady like a motion-control slider. Light steam rising from the hot dishes. Keep every plate and dish exactly as in the photo, no new food. Remove any empty or upside-down plates and glasses. Soft natural daylight, warm tones, real-footage feel, 9:16 vertical. No people, no text, no buildings.
```

**Caption önerisi:** `A table for sharing. Mezze, testi kebab and more, steps from Hagia Sophia.`
**Uygunluk:** 7/10. Önce Fuego'nun böyle bir sofra karesi olup olmadığına bakılmalı.

---

## Sonraki adım

Kart 1 için PC arşivinden ocakbaşı karesi seçilip tek video üretilebilir. Onay gelmeden kredi harcanmaz.
