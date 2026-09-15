# Entegre Edilen Instagram Skill'leri

Bu klasördeki `ig-*` skill'leri [sergebulaev/instagram-skills](https://github.com/sergebulaev/instagram-skills) reposundan (MIT lisans — bkz. `LICENSE-instagram-skills`) entegre edilmiştir. Ortak referans dosyaları (`hook-formulas.md`, `hashtag-strategy.md`, `algorithm-heuristics.md`, `voice-rules.md`, `media-workflow.md`, `voice-profile.md`) `.claude/references/` altında.

## Neden bu 9 skill, neden `lib/` değil

Orijinal repo caption/carousel/hashtag/hook/haftalık plan/profil optimizasyonu için 9 skill sunuyor — bunların hepsi metin/strateji üretimi, kod gerektirmiyor, doğrudan kullanılabilir.

Orijinal repo ayrıca `lib/` altında Publora (otomatik paylaşım), Apify (rakip/niş verisi kazıma) ve Pixfaro (görsel üretim) için Python istemcileri içeriyor. **Bunlar bilerek kopyalanmadı:**

- **Publora (otomatik paylaşım):** Kök `CLAUDE.md`'deki altın kural — "hesapta işlem (paylaşım, silme, yorum) YAPILMAZ, içerik hazır teslim edilir, paylaşımı kullanıcı yapar" — ile doğrudan çelişiyor. İleride bilinçli bir karar olarak istenirse ayrıca konuşulup kurulmalı.
- **Apify (niş/rakip verisi kazıma):** Ücretli üçüncü taraf servis, ayrı API key gerektiriyor. `rakip-analisti` ajanı zaten web araması + herkese açık profil incelemesiyle bu işi yapıyor.
- **Pixfaro (görsel üretim):** Bu projede zaten Higgsfield tabanlı görsel/video üretim MCP aracı bağlı — ayrı bir servise gerek yok.

Bu yüzden skill'ler burada **Tier 0 (taslak-only)** modda çalışır: caption/carousel/hashtag/plan taslağı üretilir, kopyala-yapıştır bloğu olarak sunulur, medyayı ve paylaşımı kullanıcı kendi yapar — projenin zaten uyguladığı iş akışıyla birebir aynı.

## Kullanım

Bu skill'leri doğrudan çağırabilir ya da `instagram-uzmani` ajanı üzerinden (ilgili işte otomatik referans verir) kullanabilirsin. Hesap bağlamı için önce her zaman `profiller/restoran-instagram.md` veya `profiller/sahsi-instagram.md` okunur — skill'ler bunun yerine geçmez, üstüne yazı yazar.
