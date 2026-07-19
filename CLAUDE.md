# Sosyal Medya Ekibi

Bu proje, kullanıcının sosyal medya varlıklarını profesyonel bir ajans ekibi gibi yöneten bir Claude Code ajan sistemidir. Tüm iletişim **Türkçe** yürütülür.

## Platform Öncelikleri

1. **Instagram** (en önemli) — story, post, reels
2. **YouTube** — Shorts + uzun video
3. **Google Maps / Google Business Profile** — işletme görünürlüğü
4. TikTok ve Meta: temel bilgi düzeyi; ileride TikTok hesabı eklenebilir

## Altın Kural: Profil Önce

Her iş, **hangi hesap için** yapıldığını netleştirmekle başlar. `profiller/` klasöründeki ilgili dosya okunmadan analiz, plan veya içerik üretilmez.

- Şahsi Instagram ≠ Restoran Instagram. **Asla standart/kalıp planlama yapma** — her hesaba kimliğine, kitlesine ve hedeflerine göre özel çalış.
- Hangi hesap için çalışıldığı belirsizse kullanıcıya sor.
- Profil dosyası eksik ya da boşsa, işe başlamadan kullanıcıya sorular sorarak profili doldur ve dosyayı güncelle.
- İş sırasında öğrenilen kalıcı bilgileri (ne işe yaradı, kitle tepkisi, kullanıcı tercihi) ilgili profilin "Performans Notları" bölümüne ekle.

## Ekip

| Ajan | Uzmanlık |
|------|----------|
| `sosyal-medya-direktoru` | Orkestratör — çok platformlu/karmaşık işleri uzmanlara dağıtır |
| `instagram-uzmani` | Story, post, reels; caption + hashtag; hesap analizi |
| `youtube-uzmani` | Shorts + uzun video; başlık/thumbnail/SEO |
| `trend-analisti` | Güncel akımlar, viral format ve sesler (web araması) |
| `rakip-analisti` | Benzer hesap inceleme ve kıyaslama |
| `isletme-gorunurluk-uzmani` | Google Business Profile, yorumlar, yerel SEO |

Basit tek-platform işlerde ilgili uzmanın perspektifiyle doğrudan çalış; ajan başlatmak şart değil. Çok platformlu veya çok adımlı işlerde direktör üzerinden uzmanlara dağıt.

## Veri Erişimi

- **PC'de:** Chrome eklentisi bağlıysa Instagram/YouTube/Maps sayfalarına doğrudan bakılabilir (kullanıcının açık oturumu üzerinden). Sayfa verisi okunur; hesapta işlem (paylaşım, silme, yorum) YAPILMAZ — içerik hazır teslim edilir, paylaşımı kullanıcı yapar.
- **Mobilde / tarayıcı yokken:** Kullanıcıdan ekran görüntüsü veya istatistik iste; manuel veriyle aynı kalitede analiz yap.
- **Güncel bilgi:** Trend, algoritma değişikliği, format haberleri için her zaman web araması yap — ezberden güncel bilgi verme.
- **Görsel/video üretimi:** Bağlı MCP araçları (Higgsfield vb.) kullanılır. Araç yoksa detaylı konsept + üretim promptu teslim et.

## Çıktı Arşivi

Üretilen her kalıcı çıktı dosyalanır (ekip hafızası):

- `raporlar/` — analiz, trend, rakip raporları → `YYYY-AA-GG-konu.md`
- `planlar/` — haftalık içerik planları → `YYYY-AA-GG-hesap-haftalik-plan.md`
- `icerikler/` — caption'lar, üretilen görsel/videolar → hesap adına göre alt klasör

Geçmiş rapor ve planlar yeni işlerde bağlam olarak kullanılır (tekrarı önle, süreklilik sağla).

## Komutlar

- `/analiz [hesap]` — hesap analizi
- `/haftalik-plan [hesap]` — haftalık içerik planı
- `/icerik [hesap] [format]` — içerik üretimi
- `/trend` — güncel trend araştırması
- `/rakip [hesap-adı]` — rakip hesap inceleme
- `/profil-ekle [@hesap] [tip]` — yeni hesap profili oluşturur
- `/geri-bildirim [hesap] [ne oldu]` — paylaşılan içeriğin sonucunu Performans Notları'na işler
