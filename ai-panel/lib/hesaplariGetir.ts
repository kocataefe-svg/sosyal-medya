import { dizinListele, dosyaOku } from "./github";
import type { HesapTanimi } from "./modTanimlari";

const ETIKET_ONCELIGI = ["Kullanıcı adı", "İşletme adı", "Kanal adı"];

function alanDegeriBul(icerik: string, etiket: string): string | null {
  const satirlar = icerik.split("\n");
  for (const satir of satirlar) {
    const eslesme = satir.match(/^-\s*\*\*(.+?):\*\*\s*(.+)$/);
    if (!eslesme) continue;
    const [, bulunanEtiket, deger] = eslesme;
    if (bulunanEtiket.includes(etiket)) {
      return deger.trim();
    }
  }
  return null;
}

function hesapAdiCikar(icerik: string, dosyaAdi: string): string {
  for (const etiket of ETIKET_ONCELIGI) {
    const deger = alanDegeriBul(icerik, etiket);
    if (deger && !deger.startsWith("_(")) {
      return deger;
    }
  }
  const baslik = dosyaAdi
    .replace(/\.md$/, "")
    .split("-")
    .map((parca) => parca.charAt(0).toUpperCase() + parca.slice(1))
    .join(" ");
  return `${baslik} (profil eksik)`;
}

export async function hesaplariGetir(): Promise<HesapTanimi[]> {
  const dosyaYollari = await dizinListele("profiller");
  const hesaplar: HesapTanimi[] = [];

  for (const yol of dosyaYollari) {
    let icerik: string | null;
    try {
      icerik = await dosyaOku(yol);
    } catch {
      continue;
    }
    if (icerik === null) continue;

    const dosyaAdi = yol.split("/").pop()!;
    const id = dosyaAdi.replace(/\.md$/, "");
    const ad = hesapAdiCikar(icerik, dosyaAdi);

    hesaplar.push({ id, ad, profilDosyasi: yol });
  }

  return hesaplar;
}
