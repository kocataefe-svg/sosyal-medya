# AI Paneli

Claude uygulaması/aboneliği gerektirmeyen, mobil öncelikli, Claude API tabanlı sosyal medya ekibi sohbet paneli. Aynı GitHub deposunu (`profiller/`, `planlar/`, `raporlar/`, `icerikler/`, `.claude/`) okur ve yazar.

Mevcut vitrin paneli (`panel/`) bu projeden bağımsızdır, ayrı bir Vercel projesi olarak kalmaya devam eder.

## Kurulum

1. `npm install`
2. `.env.local.example` dosyasını `.env.local` olarak kopyala, aşağıdaki adımlarla doldur.

### 1) Anthropic API anahtarı

- console.anthropic.com'da hesap aç, kredi kartı ekle
- Ayarlar → Limits'ten harcama limiti koy (önerilir)
- API Keys'ten yeni anahtar oluştur → `ANTHROPIC_API_KEY`

### 2) GitHub Personal Access Token

- github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens
- Sadece `sosyal-medya` deposuna, "Contents: Read and write" izniyle bir token oluştur
- `GITHUB_TOKEN` olarak kaydet; `GITHUB_OWNER=kocataefe-svg`, `GITHUB_REPO=sosyal-medya`, `GITHUB_BRANCH=master`

### 3) Oturum sırrı

Rastgele uzun bir metin üret (örn. `openssl rand -hex 32`), `SESSION_SECRET` olarak kaydet.

### 4) Kullanıcılar

Her kullanıcı için şifre hash'i üret:

```bash
node -e "console.log(require('bcryptjs').hashSync('BURAYA_SIFRE', 10))"
```

Çıkan hash'i `AI_PANEL_USERS` içine JSON dizi olarak ekle:

```json
[{"kullaniciAdi":"ata","sifreHash":"$2a$10$...","sahipMi":true},{"kullaniciAdi":"arkadas","sifreHash":"$2a$10$...","sahipMi":false}]
```

Sadece bir kullanıcıda `"sahipMi":true` olmalı — kullanım/maliyet özetini sadece o görür.

> ⚠️ **`.env.local` dosyasında `$` işaretlerini kaçırman şart.**
> bcrypt hash'leri `$2a$10$...` ile başlar ve dotenv bunları değişken referansı sanıp siler
> (belirti: doğru şifreyle bile "Kullanıcı adı veya şifre hatalı" hatası).
> `.env.local` içine yazarken her `$` yerine `\$` yaz:
>
> ```
> AI_PANEL_USERS=[{"kullaniciAdi":"ata","sifreHash":"\$2a\$10\$...","sahipMi":true}]
> ```
>
> Bu sadece yerel `.env.local` için geçerlidir. **Vercel panelindeki ortam
> değişkenlerinde kaçırma yapma** — orada değerler birebir alınır, `\$` yazarsan
> hash bozulur.

### 5) Redis (kullanım/maliyet kaydı)

Vercel'in kendi Redis ürününü kullanıyoruz (Upstash altyapılı ama `REDIS_URL`
bağlantı dizesi veriyor — eski `@vercel/kv`/`UPSTASH_REST_*` değişkenleriyle
karıştırma). Vercel projesine "Redis" entegrasyonunu eklediğinde
`REDIS_URL` otomatik gelir. Yerelde denemek için Vercel dashboard'undaki
Redis store'un bağlantı dizesini `.env.local`'e `REDIS_URL=` olarak
kopyalayabilirsin.

## Yerelde çalıştırma

```bash
npm run dev
```

http://localhost:3000 adresinde açılır.

## Test

```bash
npm test
```

## Vercel'e yayınlama (manuel adımlar)

1. vercel.com'da "Add New Project" → aynı GitHub deposunu seç
2. **Root Directory**'yi `ai-panel` olarak ayarla (önemli — depo kökü değil)
3. Environment Variables bölümüne `.env.local`'daki tüm değerleri tek tek ekle
   (hatırlatma: burada `$` kaçırma **yapma**, hash'i olduğu gibi yapıştır)
4. Storage sekmesinden **Redis** entegrasyonunu ekle (ücretsiz plan yeterli) —
   bu otomatik olarak `REDIS_URL` değişkenini projeye ekler, elle girmene gerek yok
5. Deploy'a bas

## Mimari notlar

- `lib/` altındaki saf mantık Vitest ile test edilir (`npm test`, 28 test).
- Depo (GitHub) tek doğruluk kaynağıdır; panel kendi veritabanını tutmaz
  (kullanım kayıtları hariç, onlar Redis'te).
- Sohbet geçmişi kalıcı saklanmaz (v1) — sayfa yenilenince kaybolur.
- Model varsayılanı `claude-haiku-4-5`, `CLAUDE_MODEL` ile değiştirilebilir.
