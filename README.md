# Sosyal Medya Ekibi

Instagram (öncelikli), YouTube ve Google Maps varlıklarını profesyonel bir ajans ekibi gibi yöneten Claude Code ajan sistemi.

## Hızlı Başlangıç

Bu klasörde Claude Code'u aç ve konuşmaya başla. İlk iş olarak profillerini doldurt:

```
profiller/ klasöründeki hesap profillerimi benimle konuşarak doldur
```

## Komutlar

| Komut | Ne yapar |
|-------|----------|
| `/analiz restoran` | Hesap analizi (sahsi / restoran / youtube / maps) |
| `/haftalik-plan sahsi` | Haftalık içerik planı |
| `/icerik restoran reels` | İçerik üretimi (story, post, carousel, reels, shorts, video) |
| `/trend` | Güncel trend araştırması |
| `/rakip restoran @hesapadi` | Rakip inceleme ve kıyaslama |
| `/profil-ekle @hesap tip` | Yeni hesap profili oluşturur (hesabı inceleyip taslak çıkarır) |

Komut olmadan da doğal dille her şey istenebilir: "restoran hesabı için bu haftaya 3 reels fikri ver" gibi.

## Yapı

- `.claude/agents/` — 6 uzman ajan (direktör, Instagram, YouTube, trend, rakip, işletme görünürlüğü)
- `profiller/` — hesap kimlikleri (ekibin hafızası; her iş buradan başlar)
- `raporlar/` — analiz, trend ve rakip raporları
- `planlar/` — haftalık içerik planları
- `icerikler/` — üretilen caption, görsel ve videolar
- `docs/superpowers/specs/` — tasarım dokümanı

## Vitrin Paneli

Ekibin ürettiği plan, rapor, içerik ve profilleri telefondan görüntülemek için `panel/` klasöründe statik bir panel var.

```
node panel/build.js        # markdown dosyalarından data.json üretir
npx http-server panel      # yerelde açmak için
```

Depo GitHub'a bağlanınca Vercel'e import edilerek ücretsiz yayınlanır (`vercel.json` hazır) — build sırasında `data.json` otomatik üretilir. Her yeni içerik commit+push edildiğinde panel kendini günceller.

## Mobil Erişim (iPhone)

Depo GitHub'a bağlı: claude.ai uygulamasından (veya claude.ai/code) bu depoyu açıp aynı ekiple çalışabilirsin. Telefonda tarayıcı erişimi olmadığı için hesap verilerini ekran görüntüsüyle paylaş — ekip aynı şekilde analiz eder.
