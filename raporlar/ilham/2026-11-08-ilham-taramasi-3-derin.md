# İlham Taraması 3 (derin) — 2026-11-08

**Hesap:** @fuegorestaurantcafe için · Efe "daha araştır" dedi.
**Taranan:** Keşfet (46 içerik, aşağıya kadar), #istanbulrestaurant araması (20 içerik, Sultanahmet/Sirkeci komşuları dahil). Her içeriğin beğeni/yorum sayısı sayfa bilgisinden okundu. Sadece okundu, hiçbir etkileşim yapılmadı.
**Önceki raporlarda olanlar tekrar edilmedi** (Service please, menü kartı, why you stay, letter from you).

## Büyük resim

1. **En çok patlayanlar Fuego'nun komşuları ve hepsi insan/skeç:** @barbarosaistanbul (Küçük Ayasofya, kebap) 518B beğeni / 587B paylaşım, @marandadoner (Sirkeci) 166B beğeni. İkisi de çalışan skeçi ("patron çocuğu olunca..."). Higgsfield'la yapılmaz, Efe'nin "ekip postu istemiyorum" kuralına da takılıyor. Aşağıda ayrıca soruyorum.
2. **Sultanahmet manzarası tek başına 121B beğeni getirdi:** @deraliyeterrace, terastan sabit tek çekim + tek satır yazı.
3. **Keşfet'te iki kez çıkan trend: "Don't blink"** (iki farklı hesapta). Tabak bir anda boşalıyor.
4. **Yazı + yemek tipografisi** iyi gidiyor: "LOVE" kelimesinde O harfi donut (49B beğeni), "TONIGHT WE EAT ITALIAN" dev kırmızı yazı (6,6B beğeni).

## Kartlar

| # | Kaynak | Fikir | Performans | Higgsfield | Puan |
|---|---|---|---|---|---|
| 5 | @boston_doughnuts | "FUEGO" yazısında O = üstten künefe/testi | 49,1B beğeni · 8,2B paylaşım | Var (üstten tabak klibi) | 9/10 |
| 6 | 2 hesap, Keşfet trendi | "Don't blink": tabak bir anda boşalıyor | 458+ beğeni, trend | Var (başlangıç/bitiş karesi) | 8/10 |
| 7 | @boccabocca.syd | "TONIGHT WE EAT OTTOMAN" dev yazı + loş akşam kesmeleri | 6,6B beğeni · 5,5B paylaşım | Var (akşam masası) | 8/10 |
| 8 | @deraliyeterrace (Sultanahmet) | Terastan sabit çekim + "this and your fav people" | 121B beğeni | Az (asıl gerçek çekim) | 8/10 |

---

### Kart 5 — "FUEGO" yazısında O harfi yemek · @boston_doughnuts · reels · 3 Ekim
Link: https://www.instagram.com/p/DeBpWV-Ffn-/
Performans: 49,1B beğeni · 63 yorum · 1,1B repost · 8,2B paylaşım

**Ne görünüyor:** Çelik tezgâh üstten çekiliyor. Ekranın ortasında dev beyaz serif "L O V E" yazısı var. O harfinin yerine eller sırayla farklı donut koyuyor, her 1-2 saniyede değişiyor.

**Neden işe yaramış:** Basit bir oyun; göz "sıradaki ne olacak" diye bekliyor. Logo/kelime + ürün birleşiyor, marka akılda kalıyor.

**Fuego uyarlaması:** Dev "F U E G O" yazısı, **O** harfinin yerinde sırayla üstten yuvarlak tabaklar: künefe (bakır tepside), testi kebabının ağzı, Ali Nazik tabağı, mercimek çorbası kâsesi, çay bardağı (üstten). Fuego bordo zemin ya da koyu ahşap masa.

**Girdi:** Her yemeğin tam üstten çekilmiş bir fotoğrafı (arşivdeki stüdyo serisi uygun olabilir). Yazı CapCut'ta eklenir.

**Higgsfield (her tabak için 3 sn'lik klip):**
- Model: `seedance_2_5` · image-to-video · `start_image` = üstten tabak fotoğrafı · `duration: 5` (CapCut'ta 1,5 sn'ye kesilir) · `aspect_ratio: 9:16` · ses kapalı

```
Perfectly top-down locked-off shot of a single round dish centered on a dark wooden table. Two hands gently slide the plate into the exact center of the frame and let go, then the hands leave the frame. Light steam rising from the hot food. Keep the dish, plate and food exactly as in the photo, no new food. Warm natural light, real-footage feel, 9:16 vertical. No faces, no text, no logos.
```

**Kurgu:** 5 klip × 1,2 sn, ortada sabit "F U E G O" (O boşluğu tabağa denk gelir). Son kare: logo + "Sultanahmet".
**Caption:** `Every O is a different story. Which one is yours? 🔥`

---

### Kart 6 — "Don't blink": tabak bir anda boşalıyor · Keşfet trendi (@mishri_by_ritu + bir hesap daha)
Link: https://www.instagram.com/p/DcYgKO3TZb_/
Performans: 458 beğeni (küçük hesap), ama aynı fikir Keşfet'te iki farklı hesapta çıktı, yani trend.

**Ne görünüyor:** Ekranda "Don't Blink" yazısı ve tek bir tatlı. Bir anlık kesmeyle tabak boş, sadece kırıntı kalıyor.

**Neden işe yaramış:** Kısa ve tekrar izletiyor (döngü). İzleyen "kaçırdım mı" diye geri sarıyor, izlenme süresi artıyor.

**Fuego uyarlaması:** Künefe ya da baklava. "Don't blink" yazısı, sonra tabakta sadece fıstık kırıntısı ve şerbet izi.

**Higgsfield (Kling başlangıç/bitiş karesi):**
- Model: `kling3_0` · `start_image` = dolu künefe tabağı · `end_image` = aynı tabak boş (gerçekte de çekilebilir: yemek bitince aynı açıdan) · `duration: 5` · `aspect_ratio: 9:16` · ses kapalı

```
Static close-up of a hot künefe on a copper plate, cheese pull glistening. The camera stays completely still. In a quick, seamless moment the dessert disappears bite by bite as if eaten in fast motion, ending on the empty plate with only crumbs of pistachio and syrup left, exactly as in the last frame. No hands or people visible, no new objects, same light throughout. 9:16 vertical.
```

**Not:** Bitiş karesini gerçek çekmek AI'dan daha güvenli: aynı açıyla, servis sonrası boş tabak fotoğrafı.
**Caption:** `Don't blink. 🫣 Künefe at Fuego, Sultanahmet.`

---

### Kart 7 — "TONIGHT WE EAT OTTOMAN" · @boccabocca.syd · reels · 30 Ağustos
Link: https://www.instagram.com/p/DcsJMLWRTAj/
Performans: 6,6B beğeni · 30 yorum · 115 repost · 5,5B paylaşım

**Ne görünüyor:** Ekranı kaplayan dev kırmızı dar harflerle "TONIGHT WE EAT ITALIAN". Arkada loş, sıcak, filmsi kesmeler: üstten makarna tabağı, bir el tabağa uzanıyor, ocakta ateş, kalabalık mutfak.

**Neden işe yaramış:** Yazı bir davet gibi, "bu akşam" hissi veriyor. Paylaşım beğeniye yakın: insanlar arkadaşına "bu akşam buraya gidelim" diye atıyor.

**Fuego uyarlaması:** "TONIGHT WE EAT OTTOMAN" (ya da "TONIGHT WE EAT IN SULTANAHMET"), Fuego bordosu #7A2418 ya da kırmızı. Arkada: ocakbaşı ateşi, testi kırılışı, üstten meze, mumlu masa.

**Girdi:** Mevcut testi ve ocakbaşı videoları + 1-2 akşam masası fotoğrafı.

**Higgsfield (akşam masası klibi):**
- Model: `kling3_0` · image-to-video · `start_image` = Fuego akşam masası · `duration: 5` · `aspect_ratio: 9:16` · ses kapalı

```
Moody top-down shot of a dinner table at night: Turkish dishes, a candle flickering, glasses of red wine. A hand slowly reaches in and tears a piece of warm bread. Camera slowly drifts sideways. Warm low light, deep shadows, slight film grain, cinematic colour. Keep all dishes exactly as in the photo, no new food. No faces, no text, no buildings. 9:16 vertical.
```

**Kurgu:** 5-6 kesme, her biri 1 sn, üstte sabit dev yazı. Ses: orijinal ateş/çatal sesi.
**Caption:** `Tonight we eat Ottoman. 🔥 Book your table, link in bio.`

---

### Kart 8 — Terastan manzara + tek satır · @deraliyeterrace (Sultanahmet) · reels · 9 Ekim
Link: https://www.instagram.com/p/DeR1nAKMtYe/
Performans: 121B beğeni

**Ne görünüyor:** Terasta akşamüstü, önde masalarda oturan insanlar (arkadan, yüz yok), arkada Sultanahmet silueti. Kamera sabit. Ortada küçük beyaz yazı: "this and your fav people". Caption: "perfect plan, isn't it?"

**Neden işe yaramış:** İstanbul'a gelen turist tam bunu hayal ediyor. Tek satır yazı arkadaşını etiketletiyor.

**Fuego uyarlaması:** Fuego terasından gerçek bir akşam üstü çekimi. Ön planda masa, çay/yemek. Yazı: "this and your fav people" ya da "dinner plans: sorted".

**Önemli kural:** Manzara **gerçek** çekimle olmalı. Higgsfield'a cami/minare eklettirmek yasak (Fuego kuralı). Fuego terasından manzara görünmüyorsa bu kart masa + sokak ışıklarıyla uyarlanır.

**Higgsfield (sadece hafif hareket, opsiyonel):**
- Model: `kling3_0` · image-to-video · `start_image` = Fuego terası gün batımı fotoğrafı · `duration: 5`

```
Locked-off static shot of a restaurant terrace at golden hour, exactly as in the photo. Only subtle natural motion: candle flames flicker, a light breeze moves the tablecloths, soft clouds drift slowly. Do not add or change any buildings, skyline, mosques or minarets. No new people, no text. Real-footage feel, 9:16 vertical.
```

**Caption:** `Perfect plan, isn't it? 🌅 Fuego, Sultanahmet.`

---

## Soru: komşuların skeç formatı

@barbarosaistanbul (Küçük Ayasofya, 518B beğeni) ve @marandadoner (Sirkeci, 166B beğeni) çalışanlarıyla Türkçe komik skeçler çekiyor ve bölgedeki en büyük patlamalar bunlar. Efe "ekip/isim postu istemiyorum" dedi. Ama skeç, "meet the team" postundan farklı bir format. Fuego'da da denensin mi, yoksa tamamen kapalı mı? Efe'ye soruldu.

## Takip listesine öneri

- @deraliyeterrace (Sultanahmet, Osmanlı mutfağı, manzara)
- @barbarosaistanbul (Sultanahmet komşusu, kebap)
- @boccabocca.syd (yazı + loş akşam estetiği)
