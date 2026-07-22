import SohbetEkrani from "../components/SohbetEkrani";
import { hesaplariGetir } from "../lib/hesaplariGetir";
import type { HesapTanimi } from "../lib/modTanimlari";

export default async function AnaSayfa() {
  let hesaplar: HesapTanimi[] = [];
  let hesapListesiHatasi = false;
  try {
    hesaplar = await hesaplariGetir();
  } catch {
    hesapListesiHatasi = true;
  }

  return (
    <main className="ana-sayfa">
      {hesapListesiHatasi && (
        <p className="hata-mesaji">Hesap listesi yüklenemedi, sayfayı yenileyip tekrar deneyin.</p>
      )}
      <SohbetEkrani hesaplar={hesaplar} />
    </main>
  );
}
