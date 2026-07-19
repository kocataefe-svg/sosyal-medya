---
description: Paylaşılan bir içeriğin nasıl gittiğini kaydeder — ilgili profilin Performans Notları'na işler
argument-hint: [hesap] [ne oldu] örn. restoran salı paylaştığımız reels 50k izlendi çok iyi gitti
---

Geri bildirimi kaydet: $ARGUMENTS

1. **Hesabı netleştir.** Belirtilmemişse hangi hesap olduğunu sor. `profiller/` klasöründen ilgili profil dosyasını oku.
2. **İçeriği eşleştirmeye çalış (opsiyonel, zorlama):** `planlar/` ve `icerikler/[hesap]/` klasörlerinde son zamanlarda üretilmiş, kullanıcının bahsettiği içerikle eşleşebilecek bir kayıt var mı bak (tarih/format/konu ile). Bulursan bağlam olarak kullan, bulamazsan sadece kullanıcının verdiği bilgiyle devam et — arama yapmak için ekstra soru sorup kullanıcıyı yorma.
3. **Notu yaz.** Profil dosyasındaki "Performans Notları" bölümünün sonuna, bugünün tarihiyle tek satırlık kısa ve net bir madde ekle. Format: `- YYYY-AA-GG: [özet — ne paylaşıldı, sonuç ne oldu, çıkarılan ders varsa o]`. Kullanıcının anlattığını yorumlama/abartma, olduğu gibi ama öz bir şekilde yaz.
4. **Örüntü fark edersen belirt:** Bu not, önceki notlarla birlikte bir eğilim gösteriyorsa (örn. "bu 3. kez reels'in story'den iyi gittiği" gibi), kullanıcıya kısaca söyle — bir sonraki planlamada bunu dikkate alacağını belirt.
5. **Kaydet ve kısaca onayla.** Dosyayı kaydet, tek cümlede ne kaydettiğini teyit et. Uzun özet/rapor üretme — bu hızlı bir günlük tutma işlemi.

Not: Bu komutun amacı ekibin öğrenmesini sağlamak. Buraya düşen notlar sonraki `/haftalik-plan` ve `/icerik` çalışmalarında otomatik olarak dikkate alınır (o komutlar zaten profil dosyasını okuyor).
