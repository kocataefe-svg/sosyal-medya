import type { SohbetMesaji } from "./types";

/**
 * Sohbet geçmişi her istekte bütünüyle tekrar gönderildiği için, önceki
 * turlardaki görseller (base64) de her seferinde yeniden yollanır — bu,
 * birkaç görsel-ağırlıklı tur sonra Vercel'in istek boyutu sınırına
 * çarpabilir. Claude'un o görsellere verdiği analiz zaten kendi metin
 * cevabında (icerik) kalıcı olarak duruyor, bu yüzden ham görsel verisini
 * sadece EN SON mesajda tutmak yeterli — ekranda geçmiş görseller yine de
 * görünmeye devam eder (bu fonksiyon sadece istek gövdesini hazırlar,
 * arayüzdeki `mesajlar` state'ine dokunmaz).
 */
export function istekIcinMesajlariHazirla(mesajlar: SohbetMesaji[]): SohbetMesaji[] {
  const sonIndex = mesajlar.length - 1;
  return mesajlar.map((mesaj, i) => {
    if (i === sonIndex || !mesaj.gorseller) {
      return mesaj;
    }
    return { rol: mesaj.rol, icerik: mesaj.icerik };
  });
}
