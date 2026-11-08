---
description: Restoran/kafe hesaplarının reels ve gönderilerinden Fuego'ya uyanları seçip Higgsfield prompt'una çevirir
argument-hint: [opsiyonel: @hesap veya reels linki] örn. @lokantalimu
---

İlham taraması yap: $ARGUMENTS

`ilham-avcisi` ajanının protokolüyle çalış:

1. `profiller/restoran-instagram.md` dosyasını oku (kimlik, kurallar, "İlham Takip Listesi").
2. Argüman olarak hesap/link verildiyse sadece ona bak; verilmediyse takip listesindeki hesapları tara (her hesaptan son 12 reels + son 6 gönderi).
3. Veri: Chrome bağlıysa `instagram.com/[hesap]/reels/` üzerinden görüntülenme sayılarını oku. Chrome yoksa kullanıcıdan link veya ekran görüntüsü iste.
4. Seçim kriterlerini uygula (performans + Fuego uyumu + üretilebilirlik). En fazla 5 içerik seç.
5. Her biri için çıktı kartını doldur: analiz + Fuego uyarlaması + Higgsfield model/ayar + İngilizce prompt + caption.
6. `raporlar/ilham/YYYY-AA-GG-ilham-raporu.md` olarak kaydet, commit + push et.
7. Kullanıcıya en iyi 1-2 öneriyi kısaca özetle ve hangisini üretmek istediğini sor. Onay gelmeden kredi harcama.
