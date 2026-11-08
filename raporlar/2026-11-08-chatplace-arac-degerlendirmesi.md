# ChatPlace (chatplace.io) — Araç Değerlendirmesi

**Tarih:** 2026-11-08
**Yöntem:** REA MCP ile kontrollü tarayıcı senaryosu (Chrome, tr-TR, İstanbul saati). Okunan sayfalar: `/tr` (ana sayfa), `/tr/instagram`, `/tr/pricing`, `/tr/ai-agent`. Sayfa erişilebilirlik ağacı ve ağ trafiği alındı. Hesap açılmadı, uygulama içi (app.chatplace.io) test edilmedi. Katlanmış SSS cevapları okunmadı.

## Ne işe yarıyor?

Instagram / TikTok / Telegram için **DM otomasyonu + AI müşteri temsilcisi** platformu (ManyChat'e benzer bir ürün). Meta tarafından onaylı olduğunu söylüyor, yani resmi API kullanıyor; ban riski düşük.

| Özellik | Ne yapıyor |
|---|---|
| **Anahtar kelime chatbot'u** | Reels/posta "MENU yaz" gibi bir kelimeyle yorum yapanlara otomatik DM gönderiyor |
| **Takipçi kontrolü** | DM'deki içeriği (link, menü, indirim) sadece takip edenlere açıyor; takip etmeyene önce "takip et" diyor |
| **AI yönetici** | DM'lere, yorumlara, etiketlere ve story yanıtlarına 7/24 cevap veriyor. Senin içeriğinden ve yüklediğin dosyalardan öğreniyor, gerektiğinde konuşmayı sana devrediyor, kişileri CRM'e kaydedip etiketliyor |
| **Satış hunileri / toplu mesaj** | Daha önce yazışan kişilere segment bazlı toplu DM |
| **Oyunlaştırma + yönlendirme** | Etkileşime puan veriyor, skor tablosu tutuyor, arkadaş davet edene ödül veriyor |
| **CRM / entegrasyon** | Google Sheets, ödeme sistemleri. Rezervasyon ve ödeme takibi **"yakında"** diye yazıyor, yani şu an yok |
| **Virale (AI Creator)** | Karusel ve video üretimi, Reels/rakip analizi, senaryo yazımı |

## Fiyatlar (sitede görülen, aylık)

| Plan | Aylık | Yıllık ödemede | İçerik |
|---|---|---|---|
| **Free** | ₺0 | — | Ayda 200 aktif kişi, 1 hesap, otomasyonlarda "Powered by ChatPlace" etiketi |
| **Pro** | ₺700 | ₺560 | Sınırsız kişi, chatbot + toplu mesaj, etiket yok, 7 gün deneme. **AI yok** |
| **Creator** | ₺1.500 | ₺1.200 | Pro + AI yönetici (~3.000 mesaj/yorum ayda) + AI Creator + 2.500 kredi, 14 gün deneme |
| **Premium** | ₺8.000 | ₺6.400 | Tüm AI limitleri ×10, sınırsız hesap |

Ek hesap: +₺560 her biri (Pro/Creator).

## Bizim hesaplara uygunluğu

### Fuego (@fuegorestaurantcafe) — **Evet, sınırlı ve kontrollü şekilde**

İşe yarayacağı yerler:
1. **Reels → yorum → DM akışı.** "Comment **MENU** and we'll DM you our menu + reservation link" CTA'sı. Bu, profil hedefindeki **rezervasyon linki tıklaması** metriğini doğrudan besler. Yorum sayısı arttığı için algoritma da reels'i daha çok dağıtır. **Free plan yeter** (414 takipçide ayda 200 aktif kişi sınırı şimdilik aşılmaz).
2. **Takipçi kontrolü.** Menüyü/küçük ikramı "takip edene" açmak, +400-600 takipçi hedefine katkı verir. Not: Turist kitlesi zorlanmaya karşı hassas, "takip et" şartı bazılarını kaçırabilir. A/B gibi dene.
3. **Turist SSS'lerine İngilizce otomatik cevap** (saatler, konum, rezervasyon, vejetaryen/helal, dress code). Sadece **sabit kurallı chatbot** ile, yani Pro'da AI gerekmez.

Kullanılmamalı / ertelenmeli:
- **AI yönetici (Creator, ₺1.200-1.500/ay):** Şu anki DM hacmi bunu karşılamaz. Ayrıca AI'ın fiyat, alerjen veya müsaitlik konusunda yanlış bilgi verme riski bir restoran için ciddi. Rezervasyon entegrasyonu da henüz yok. DM'ler haftada onlarca olunca yeniden değerlendir.
- **Oyunlaştırma / yönlendirme:** 3-5 günlüğüne gelen tek seferlik turist kitlesine uymuyor.
- **Virale / AI Creator:** Ekipteki içerik süreci ve Higgsfield ile çakışıyor. Ayrıca kayıtlı geri bildirimimiz gerçek çekimi tercih ediyor.

### Şahsi Instagram — **Gerek yok**

Lifestyle hesabı, satış/DM yükü yok. En fazla, gezi/yemek reels'lerinde "yorum yaz, mekan linkini atayım" akışı yorum sayısını artırabilir. Ama bu öncelik değil; asıl büyüme boşluğu hâlâ reels üretimi.

## Dikkat edilecekler

- **Free plandaki "Powered by ChatPlace" etiketi** DM'lerde görünür. Fuego'nun premium/heritage imajına hafif zarar verebilir. Kalıcı kullanımda Pro'ya (₺560-700) geçmek gerekir.
- **Veri / KVKK:** Site Yandex Metrica, Meta Pixel, TikTok ve Amplitude izleyicileri yüklüyor. Blog vaka linkleri Rusça, yani şirket BDT kökenli görünüyor. KVKK aydınlatma metni var. Hesaba bağlanırken müşteri DM'lerinin üçüncü tarafta işleneceği bilinmeli.
- **Vaka sonuçları** ("+213 bin takipçi", "%163 erişim") şirketin kendi pazarlama iddiaları, bağımsız doğrulanmadı.
- **Alternatif:** ManyChat aynı kategorinin bilinen aracı. Fiyat/özellik kıyası bu raporda yapılmadı.

## Öneri

1. Fuego için **Free plan** aç, tek bir otomasyon kur: bir sonraki reels'te "Comment MENU". İngilizce DM'de menü + `fuegosultanahmet.com/?lang=en#rezervasyon` linki olsun.
2. 2 hafta sonra bak: yorum sayısı, DM gönderimi, rezervasyon linki tıklaması (`/geri-bildirim` ile Performans Notları'na işle).
3. İşe yararsa ve etiket rahatsız ederse Pro'ya geç. AI yöneticiyi ancak DM hacmi ciddileşince düşün.
