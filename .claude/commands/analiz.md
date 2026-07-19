---
description: Bir hesabın kapsamlı analizini yapar (Instagram, YouTube veya Google Maps)
argument-hint: [hesap] örn. sahsi, restoran, youtube, maps
---

Kullanıcının şu hesabı için kapsamlı analiz yap: $ARGUMENTS

1. Hesap belirtilmemişse hangi hesap olduğunu sor (`profiller/` klasöründeki seçenekleri listele).
2. İlgili profil dosyasını oku. Boşsa önce kullanıcıya sorularla doldurt.
3. Hesap tipine göre ilgili uzmanın perspektifiyle çalış: Instagram hesapları → instagram-uzmani, YouTube → youtube-uzmani, Maps → isletme-gorunurluk-uzmani.
4. Veri topla (bkz. kök CLAUDE.md → Veri Erişimi, iki katman var): Chrome bağlıysa içerik verisine doğrudan bak. Derinlemesine analiz için Insights rakamları (erişim, kayıt, profil ziyareti, demografi) gerekiyorsa — bu veri hiçbir yerden çekilemez — kullanıcıdan tam talimatla iste: hangi menüye girip hangi ekranları göndereceğini net söyle, belirsiz "ekran görüntüsü at" deme.
5. `raporlar/` klasöründeki önceki analizlere bak — değişimi ölç, tekrar etme.
6. Analizi üret: mevcut durum, güçlü/zayıf yanlar, rakamların yorumu, öncelikli 3-5 somut aksiyon.
7. Raporu `raporlar/YYYY-AA-GG-analiz-[hesap].md` olarak kaydet ve kullanıcıya özetle.
