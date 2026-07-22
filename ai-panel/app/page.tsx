import SohbetEkrani from "../components/SohbetEkrani";
import { hesaplariGetir } from "../lib/hesaplariGetir";

export default async function AnaSayfa() {
  const hesaplar = await hesaplariGetir();

  return (
    <main className="ana-sayfa">
      <SohbetEkrani hesaplar={hesaplar} />
    </main>
  );
}
