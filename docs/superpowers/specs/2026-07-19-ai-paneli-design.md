# AI Paneli (ai-panel/) — Tasarım Dokümanı

**Tarih:** 2026-07-19
**Durum:** Onaylandı (kullanıcı onayı alındı)

## Amaç

Kullanıcının, **Claude uygulaması/aboneliği olmadan**, mobil tarayıcıdan (ve masaüstünden) erişip sosyal medya ekibiyle sohbet edebileceği, Claude API tabanlı bağımsız bir web uygulaması. Mevcut Claude Code sistemine (`.claude/agents/`, `.claude/commands/`, `profiller/`, `planlar/`, `raporlar/`, `icerikler/`) paralel çalışır, aynı GitHub deposunu ve dosya yapısını kullanır.

## Neden

Kullanıcı, Claude Pro aboneliği olmadan (ya da ek olarak) 3-5 kişilik küçük bir ekiple mobil üzerinden tam özellikli erişim istiyor. Free plan Claude Code'u desteklemiyor (Pro ve üstü gerektiriyor); API tabanlı kendi uygulaması, kullanım bazlı ödeme ile bu ihtiyacı karşılıyor ve genellikle Pro'dan daha ucuz kalıyor (hafif/orta kullanımda).

## Kapsam

**Dahil:**
- Sohbet arayüzü (mobil öncelikli, masaüstünde de çalışır)
- 6 ajan + 7 komutun stratejik/metinsel kısımları (analiz, haftalık plan, içerik/caption/hashtag üretimi, trend araştırması, rakip inceleme, geri bildirim, profil ekleme)
- GitHub deposundan profil/plan/rapor okuma ve **yazma** (üretilen içerik doğrudan commit edilir)
- Web arama (trend/rakip araştırması için)
- 3-5 sabit kullanıcı hesabı, şifreli giriş
- Kullanım/maliyet takibi (sadece proje sahibine görünür)

**Kapsam dışı (teknik olarak imkansız veya bilinçli hariç tutuldu):**
- Chrome ile hesaba bakma (kullanıcının oturumuna bağlı, sunucudan erişilemez) — bu iş PC/Claude Code tarafında kalır
- Görsel/video üretimi (Higgsfield vb. MCP araçları bu ortama bağlı değil)
- Zamanlanmış görevler (`haftalik-trend-raporu`, `haftalik-icerik-planlari`) — bunlar Claude'un kendi scheduled-tasks sistemi üzerinden çalışmaya devam ediyor, bu projeden bağımsız ve etkilenmiyor

## Mimari

Aynı GitHub deposunda **yeni, ayrı bir Next.js mini-uygulaması** (`ai-panel/`), **ayrı bir Vercel adresinde** yayınlanır. Mevcut statik vitrin paneli (`panel/`) hiç değişmez, paralel çalışmaya devam eder.

```
Kullanıcı (mobil/masaüstü tarayıcı)
        │
        ▼
ai-panel/ (Next.js, Vercel)
        │
        ├── Giriş (3-5 sabit hesap, oturum çerezi)
        ├── Sohbet ekranı (hesap seç + mod seç + mesajlaş)
        ├── API rotası:
        │     - Seçilen moda göre .claude/agents/ + .claude/commands/
        │       içeriğini ve ilgili profili GitHub'dan okur
        │     - Bunu sistem talimatı olarak Claude API'ye (Haiku 4.5) yollar
        │     - Araçlar: dosya okuma/yazma (GitHub Contents API),
        │       web arama (native Claude API aracı)
        │     - Üretilen içerik planlar/raporlar/icerikler'e commit edilir
        │     - Her istek Vercel KV'ye kullanım kaydı olarak yazılır
        └── Kullanım görünümü (sadece proje sahibine)
                │
                ▼ (commit → push tetikler)
        panel/ (mevcut statik vitrin, otomatik güncellenir)
```

## Bileşenler

**Giriş:** 3-5 sabit hesap, kullanıcı adı+şifre (ortam değişkenlerinde/Vercel KV'de hash'lenmiş saklanır). Basit imzalı oturum çerezi (HttpOnly).

**Sohbet ekranı (mobil öncelikli):** Hesap seçici (restoran/şahsi/youtube/maps) + mod seçici (analiz/haftalık plan/içerik/trend/rakip/geri bildirim/profil ekle) + mesaj alanı. Dokunmatik butonlar, klavye açılınca kayan sohbet alanı, küçük ekranda okunaklı tipografi — mevcut vitrin panelinin mobil tasarım diliyle tutarlı. Masaüstünde de düzgün çalışır ama öncelik telefon; test hem gerçek mobil tarayıcıda hem masaüstünde yapılır.

**API rotası (agent orkestrasyon):** Seçilen mod → ilgili `.claude/agents/*.md` ve `.claude/commands/*.md` dosyasının içeriği + ilgili `profiller/*.md` dosyası GitHub API'den okunur → Claude API'ye sistem talimatı olarak geçirilir. Model: **Haiku 4.5** (kullanıcı seçimi, maliyet önceliği; ileride Sonnet 5'e yükseltme kolay — ortam değişkeniyle).

**Araçlar:**
- `read_file` / `write_file` — GitHub Contents API üzerinden depodaki dosyaları okur/yazar (üretilen plan/rapor/içerik doğrudan ilgili klasöre commit edilir)
- Native web arama — trend/rakip araştırması için

**Otomatik zincirleme:** AI panelinin yaptığı commit → push → Vercel, mevcut vitrin panelinin build'ini otomatik tetikler (zaten `vercel.json` → `node panel/build.js`). İki panel birbirini besler, ekstra entegrasyon gerekmez.

**Kullanım takibi:** Her API isteği (kullanıcı, model, girdi/çıktı token sayısı, tahmini maliyet, zaman damgası) Vercel KV'ye kaydedilir. Sadece proje sahibi (kullanıcı) bu toplamları görebileceği bir görünüme erişir; diğer kullanıcılar sadece kendi sohbet ekranını görür.

## Veri Akışı

1. Kullanıcı giriş yapar (kullanıcı adı+şifre) → oturum çerezi alır
2. Hesap + mod seçer, mesaj yazar
3. API rotası: ilgili ajan/komut talimatı + profil GitHub'dan okunur → Claude API'ye gönderilir
4. Claude gerekirse `read_file`/`write_file`/web arama araçlarını çağırır (ör. önceki planlara bakmak, yeni planı kaydetmek)
5. Cevap kullanıcıya döner; kullanım kaydı Vercel KV'ye yazılır
6. Eğer dosya yazıldıysa → GitHub'a commit → Vercel otomatik olarak vitrin panelini yeniden derler

## Hata Durumları

- **GitHub API hatası** (yetki/limit): Kullanıcıya net mesaj — "Depoya erişilemedi, [sebep]". Claude'un kendi başına retry denemesi olur ama sürekli başarısızsa kullanıcıya bildirilir, sessizce yutulmaz.
- **Claude API hatası/reddi**: Kullanıcıya gösterilir, tekrar deneme imkanı sunulur.
- **Harcama limiti**: Anthropic Console'da harcama limiti (backstop) kullanıcı tarafından ayarlanır — sürpriz fatura riskine karşı ek güvenlik, bu uygulamanın kendisi zorlamaz ama önerilir.
- **Kimlik doğrulama hatası**: Yanlış şifre → genel "hatalı giriş" mesajı (kullanıcı adı/şifre ayrımı yapılmaz, brute-force ipucu verilmez).

## Maliyet

Model: Haiku 4.5. Tahmini aylık maliyet (3-5 kişilik ekip): hafif kullanım $2-3, orta kullanım $5-8, yoğun kullanım $12-17. Kullanıcı ileride Sonnet 5'e geçmeyi değerlendirebilir (ortam değişkeniyle tek satır değişiklik).

## Kullanıcının Yapması Gereken Ön Adımlar (teknik olarak Claude tarafından yapılamaz)

1. console.anthropic.com'da hesap açmak
2. API anahtarı almak
3. Kredi kartı eklemek + harcama limiti belirlemek
4. Vercel KV kurulumu için Vercel hesabından onay vermek (Vercel dashboard üzerinden birkaç tıklama)

## Hibrit Kullanım (AI Paneli ↔ Claude Pro/Code)

AI paneli ile mevcut Claude Code sistemi (PC'de veya Pro abonelikli mobilde) **aynı GitHub deposunu** paylaşır — rakip değil, aynı verinin iki farklı erişim kapısıdır. Kullanıcı istediği zaman ikisi arasında geçiş yapabilir: AI panelinde üretilen içerik commit edildiği an Claude Code tarafında da görünür, tam tersi de geçerli. Chrome ile hesaba bakma veya görsel üretimi gerektiğinde kullanıcı Pro hesabıyla Claude Code'u açar, iş bitince AI paneline geri döner — veri kaybı veya çakışma olmaz.

## Kapsam Dışı Notlar

- Kayıt/self-signup yok — hesaplar kullanıcı tarafından/Claude yardımıyla elle tanımlanır.
- Sohbet geçmişi kalıcı saklanmaz (v1) — üretilen içerik zaten dosya olarak commit edildiği için kalıcılık orada sağlanır; ham sohbet akışı oturum bazlı, sayfa yenilenince kaybolabilir. İleride istenirse eklenebilir.
- Mevcut vitrin paneli (`panel/`) bu projeden etkilenmez, değişmez.
