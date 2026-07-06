# Sosyal Medya Ekibi — Tasarım Dokümanı

**Tarih:** 2026-07-06
**Durum:** Onaylandı (kullanıcı onayı alındı)

## Amaç

Kullanıcının Instagram (öncelikli), YouTube ve Google Maps varlıklarını profesyonel bir sosyal medya ekibi gibi yöneten, Claude Code üzerinde çalışan bir ajan sistemi. TikTok ve Meta için temel bilgi düzeyi yeterli; ileride TikTok hesabı eklenebilir.

## Kullanıcı Gereksinimleri

- Bireysel VE işletme (restoran) Instagram hesaplarının ayrı ayrı, hesaba özel yönetimi — standart/kalıp planlama yok
- Hesap analizi, trend analizi, rakip hesap incelemesi ve kıyaslama
- Güncel sosyal medya akımlarının sürekli takibi
- YouTube için ayrı uzman (Shorts + uzun video)
- Instagram için ayrı uzman (story, post, reels)
- Google Maps / işletme görünürlüğü yönetimi
- Tam kapsam: strateji + caption/hashtag + görsel/video üretimi
- Mobil (iPhone) erişim: GitHub deposu üzerinden Claude Code web/mobil ile

## Kararlar

| Konu | Karar |
|------|-------|
| Veri erişimi | Tarayıcı (Chrome eklentisi) ile; mobilde ekran görüntüsü/manuel veri |
| Meta/Facebook | Şimdilik kapsam dışı, temel bilgi düzeyinde |
| Trend takibi | İstek üzerine + haftalık otomatik trend raporu |
| Üretim kapsamı | Strateji + metin + görsel/video (bağlı AI araçlarıyla) |
| "Yapay zeka motoru" | Ek motor yok — Claude'un kendisi; görsel/video için bağlı MCP araçları, güncel bilgi için web araması |
| Mimari | Claude Code ajan ekibi (A seçeneği), GitHub deposu ile mobil erişim |

## Mimari

### Ajanlar (`.claude/agents/`)

1. **sosyal-medya-direktoru** — Orkestratör. Karmaşık/çok platformlu işleri uzmanlara dağıtır, çıktıları birleştirir.
2. **instagram-uzmani** — Story, post, reels stratejisi; caption + hashtag; paylaşım saatleri; hesap analizi.
3. **youtube-uzmani** — Shorts + uzun video; başlık, açıklama, thumbnail, SEO; kanal büyütme.
4. **trend-analisti** — Web aramasıyla güncel akımlar, viral sesler/formatlar; haftalık trend raporu.
5. **rakip-analisti** — Benzer hesapların incelenmesi, kıyaslama, çıkarılan dersler.
6. **isletme-gorunurluk-uzmani** — Google Business Profile, yorum yanıtları, yerel SEO; temel Meta/TikTok bilgisi.

### Hesap Profilleri (`profiller/`)

Her hesap için bir dosya: kimlik, ton, hedef kitle, hedefler, yasaklar, performans notları.
- `sahsi-instagram.md`
- `restoran-instagram.md`
- `youtube-kanali.md`
- `google-maps.md`
- (ileride) `tiktok.md`

**Kural:** Her ajan işe başlamadan önce ilgili profili okur. Profil eksikse kullanıcıya sorarak doldurur.

### Komutlar (`.claude/commands/`)

- `/analiz [hesap]` — hesap analizi
- `/haftalik-plan [hesap]` — haftalık içerik planı
- `/icerik [hesap] [format]` — içerik üretimi (story/post/reels/shorts/video)
- `/trend` — güncel trend araştırması
- `/rakip [hesap-adı]` — rakip inceleme

### Çıktı Arşivi

- `raporlar/` — analiz, trend ve rakip raporları (tarihli)
- `planlar/` — haftalık içerik planları
- `icerikler/` — üretilen caption'lar, görsel/video dosyaları

### Otomatik Takip

Haftada bir çalışan zamanlanmış görev: trend-analisti perspektifiyle haftalık trend raporu üretir, `raporlar/` klasörüne yazar.

### Veri Akışı

- **PC:** Chrome eklentisiyle Instagram/YouTube/Maps sayfalarına doğrudan bakış.
- **Mobil:** Kullanıcı ekran görüntüsü veya istatistik yapıştırır; ekip aynı şekilde analiz eder.
- **Görsel/video üretimi:** Bağlı MCP araçları (Higgsfield vb.).
- **Güncel bilgi:** Web araması.

## Hata Durumları

- Profil dosyası boş/eksik → ajan kullanıcıya sorar, cevaplarla profili günceller.
- Tarayıcı erişimi yok (mobil) → manuel veri moduna düşer.
- Görsel üretim aracı erişilemez → konsept + prompt metni üretir, kullanıcı başka araçta kullanabilir.

## Kapsam Dışı (v1)

- Otomatik paylaşım/yayınlama (API onayları gerektirir; içerik hazır teslim edilir, paylaşımı kullanıcı yapar)
- Meta/Facebook yönetimi
- Web paneli (ileride ihtiyaç olursa bu yapının üstüne kurulabilir)
