---
description: Yeni bir hesap için otomatik profil dosyası oluşturur (hesabı inceleyip taslak çıkarır)
argument-hint: [@hesapadi] örn. @lezzetduragi, @aliveli, kanal-adi
---

Yeni hesap profili oluştur: $ARGUMENTS

1. **Önce sadece hesabı al.** Hangi hesabı ekliyoruz (kullanıcı adı/link/kanal adı)? Bu adımda tip sorma — sadece hesabı netleştir. Belirtilmemişse "hangi hesabı eklemek istiyorsun?" diye sor.
2. **Hesabı incele.** Chrome bağlıysa hesabın herkese açık sayfasına git ve şunları çıkar: bio/açıklama, takipçi-takip-gönderi sayıları, son içeriklerin konuları ve formatları, paylaşım sıklığı, ses tonu, görsel tarz. Chrome yoksa kullanıcıdan ekran görüntüsü iste ve/veya web aramasıyla bilgi topla. Bu inceleme genelde hesabın türünü de netleştirir (bio'da "restoran", "menü", "rezervasyon" geçiyorsa işletme; kişisel paylaşımlar varsa şahsi vb.).
3. **Tipi belirle — incelemeden çıkardığını onaylat, çıkaramadıysan sor.** "Bu bir işletme/restoran hesabı mı yoksa kişisel mi?" gibi tek bir soru yeter. Diğer tipler (youtube, maps, tiktok) hesabın platformundan zaten bellidir, ayrıca sorma. Hesap sahibinin kim olduğunu da bu sırada öğren (kullanıcının kendisi mi, arkadaşı mı, müşterisi mi) — profil dosyasına not düş.
4. **Mevcut profilleri kontrol et:** `profiller/` klasöründe aynı hesap için dosya var mı? Varsa yenisini açma, mevcut olanı güncellemeyi öner.
5. **Taslak profili oluştur:** `profiller/` klasöründeki aynı tipteki mevcut şablonun yapısını birebir kullan (örn. restoran için `restoran-instagram.md` yapısı). Dosya adı: `[hesap-adi]-[tip].md` (küçük harf, boşluksuz). İnceleme ile doldurabildiğin her alanı doldur; emin olmadıklarını "_(tahmin — onaylat)_" diye işaretle.
6. **Eksikleri kullanıcıyla tamamla:** Otomatik dolduramadığın kritik alanları (hedefler, yasaklar, üretim kapasitesi, hedef kitle) kullanıcıya tek tek sorarak doldur. Tahmin işaretli alanları onaylat.
7. **Kaydet ve özetle:** Dosyayı kaydet, kullanıcıya profilin özetini göster ve bu hesap için ilk önerilecek adımı söyle (genelde `/analiz` veya `/haftalik-plan`).

Not: Bu komut arkadaş/müşteri hesapları için de kullanılır — her hesap kendi profiliyle, kendi kimliğine göre yönetilir. Asla başka bir hesabın planı kopyalanmaz.
