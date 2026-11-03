---
description: Günlük sabah brifingi — bugün ne paylaşılacak, dünkü sonuç, topluluk, günün büyüme taktiği
argument-hint: [hesap]
---

`buyume-direktoru` ajanının "Sabah brifingi" protokolünü uygula. Önce `profiller/restoran-instagram.md`, bu haftanın plan dosyası, `raporlar/brifingler/` altındaki son 14 günün brifingleri ve `veri/instagram/` altındaki en yeni veri dosyasını oku. `IG_ACCESS_TOKEN` varsa önce `node scripts/instagram-veri.mjs` ile taze veri çek. Brifingi `raporlar/brifingler/YYYY-AA-GG.md` olarak kaydet ve kullanıcıya en fazla ~12 satırla yaz.
