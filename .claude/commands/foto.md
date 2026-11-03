---
description: Gönderilen fotoğraf/video ile ne yapılabileceğini çıkarır, hazır taslak yazar ve içerik takvimine ekler
argument-hint: [hesap] [fotoğraf yolu veya "son gönderilen"]
---

Kullanıcı bir fotoğraf/video gönderdi ve "bununla ne yapabiliriz" diye soruyor (ya da sadece fotoğrafı attı). Hesap belirtilmemişse varsayılan `profiller/restoran-instagram.md`. Fotoğrafı ve profili oku, sonra TEK mesajda şunları ver:

1. **Değerlendirme** (`higgsfield-uzmani` bakışı): kare ne gösteriyor, kalite/ışık yeterli mi, gereken küçük düzeltme.
2. **3 fikir**, her biri farklı formatta (`reels-uzmani`, `carousel-gorsel-uzmani`, `story-topluluk-uzmani` bakışları): konsept, neden büyümeye katkı verir, ek çekim gerekiyor mu.
3. **Önerilen fikir ve tam taslak** (`caption-dil-uzmani`): İngilizce caption, hashtag'ler, ekran yazısı, kapak, önerilen gün/saat.
4. **Takvim** (`icerik-takvimi-yoneticisi`): taslağı `icerikler/<hesap-klasoru>/taslaklar/YYYY-AA-GG-konu.md` olarak kaydet, fotoğrafı `icerikler/<hesap-klasoru>/cekimler/` altına kopyala, haftalık plan dosyasına "Taslak hazır" satırı ekle. Plan dosyası güncellendiği için CLAUDE.md'deki otomatik commit+push kuralı geçerli; taslak/fotoğraf (`icerikler/`) için commit öncesi onay iste.

AI ile video/görsel üretimi (Higgsfield) önerilebilir ama kullanıcı o fikri seçmeden kredi harcayan üretim yapılmaz.
