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

Komut olmadan da doğal dille her şey istenebilir: "restoran hesabı için bu haftaya 3 reels fikri ver" gibi.

## Yapı

- `.claude/agents/` — 6 uzman ajan (direktör, Instagram, YouTube, trend, rakip, işletme görünürlüğü)
- `profiller/` — hesap kimlikleri (ekibin hafızası; her iş buradan başlar)
- `raporlar/` — analiz, trend ve rakip raporları
- `planlar/` — haftalık içerik planları
- `icerikler/` — üretilen caption, görsel ve videolar
- `docs/superpowers/specs/` — tasarım dokümanı

## Mobil Erişim (iPhone)

Depo GitHub'a bağlı: claude.ai uygulamasından (veya claude.ai/code) bu depoyu açıp aynı ekiple çalışabilirsin. Telefonda tarayıcı erişimi olmadığı için hesap verilerini ekran görüntüsüyle paylaş — ekip aynı şekilde analiz eder.
