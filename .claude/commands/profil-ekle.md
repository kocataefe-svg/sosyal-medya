---
description: Yeni bir hesap için otomatik profil dosyası oluşturur (hesabı inceleyip taslak çıkarır)
argument-hint: [@hesapadi] [tip] örn. @lezzetduragi restoran, @aliveli sahsi, kanal-adi youtube
---

Yeni hesap profili oluştur: $ARGUMENTS

1. **Hesap adı ve tipi netleştir.** Tip seçenekleri: sahsi (kişisel Instagram), restoran/isletme (işletme Instagram), youtube, maps, tiktok. Belirtilmemişse sor. Hesap sahibinin kim olduğunu da öğren (kullanıcının kendisi mi, arkadaşı mı, müşterisi mi) — profil dosyasına not düş.
2. **Mevcut profilleri kontrol et:** `profiller/` klasöründe aynı hesap için dosya var mı? Varsa yenisini açma, mevcut olanı güncellemeyi öner.
3. **Hesabı incele (otomatik veri toplama):**
   - Chrome bağlıysa hesabın herkese açık sayfasına git ve şunları çıkar: bio/açıklama, takipçi-takip-gönderi sayıları, son içeriklerin konuları ve formatları (reels/post/carousel ağırlığı), paylaşım sıklığı, ses tonu, görsel tarz, öne çıkanlar.
   - Chrome yoksa: kullanıcıdan ekran görüntüsü iste ve/veya web aramasıyla hesap hakkında bilgi topla.
4. **Taslak profili oluştur:** `profiller/` klasöründeki aynı tipteki mevcut şablonun yapısını birebir kullan (örn. restoran için `restoran-instagram.md` yapısı). Dosya adı: `[hesap-adi]-[tip].md` (küçük harf, boşluksuz). İnceleme ile doldurabildiğin her alanı doldur; emin olmadıklarını "_(tahmin — onaylat)_" diye işaretle.
5. **Eksikleri kullanıcıyla tamamla:** Otomatik dolduramadığın kritik alanları (hedefler, yasaklar, üretim kapasitesi, hedef kitle) kullanıcıya tek tek sorarak doldur. Tahmin işaretli alanları onaylat.
6. **Kaydet ve özetle:** Dosyayı kaydet, kullanıcıya profilin özetini göster ve bu hesap için ilk önerilecek adımı söyle (genelde `/analiz` veya `/haftalik-plan`).

Not: Bu komut arkadaş/müşteri hesapları için de kullanılır — her hesap kendi profiliyle, kendi kimliğine göre yönetilir. Asla başka bir hesabın planı kopyalanmaz.
