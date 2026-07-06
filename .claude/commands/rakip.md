---
description: Rakip/benzer hesapları inceler ve kıyaslama raporu çıkarır
argument-hint: [rakip hesap adları] ve/veya [hangi hesabımız için] örn. restoran @rakipmekan
---

Rakip hesap analizi yap: $ARGUMENTS

rakip-analisti ajanının protokolü ve inceleme çerçevesiyle çalış:

1. Kıyaslamanın hangi hesabımız için olduğunu netleştir; `profiller/` klasöründen profili oku.
2. Rakip hesap adı verilmediyse 3-5 uygun rakip öner (aynı şehir/kategori ya da aynı içerik alanı) ve kullanıcıya onaylat.
3. Veri topla: Chrome bağlıysa rakiplerin herkese açık profillerine doğrudan bak; değilse web araması + kullanıcıdan ekran görüntüsü.
4. İnceleme çerçevesini uygula: format dağılımı, içerik kalıpları, en iyi performans gösteren içerikler ve nedenleri, ton/görsel kimlik, etkileşim sağlığı, zayıf noktalar.
5. Kıyaslama çıktısı: yan yana tablo + bize uyarlanabilir 3-5 taktik + yapmamamız gerekenler + fark yaratma alanı.
6. Raporu `raporlar/YYYY-AA-GG-rakip-analizi-[hesap].md` olarak kaydet ve kullanıcıya özetle.
