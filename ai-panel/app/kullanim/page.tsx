import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { oturumTokeniDogrula } from "../../lib/auth";
import { kullanimOzetiGetir, type KullaniciOzeti } from "../../lib/kullanimKaydi";

export default async function KullanimSayfasi() {
  // Next.js 15'te cookies() asenkron — await zorunlu.
  const cerezDeposu = await cookies();
  const token = cerezDeposu.get("oturum")?.value;
  const oturum = token ? await oturumTokeniDogrula(token) : null;

  if (!oturum) {
    redirect("/login");
  }
  if (!oturum.sahipMi) {
    return (
      <main className="kullanim-sayfasi">
        <p>Bu sayfayı görüntüleme yetkin yok.</p>
      </main>
    );
  }

  // Redis'e ulaşılamazsa sayfayı çökertmek yerine açıkla.
  let ozet: KullaniciOzeti[];
  try {
    ozet = await kullanimOzetiGetir();
  } catch (hata) {
    return (
      <main className="kullanim-sayfasi">
        <h1>Kullanım Özeti</h1>
        <p>Kullanım kaydı okunamadı — Redis bağlantısı kurulamıyor olabilir.</p>
        <p className="hata-mesaji">
          {hata instanceof Error ? hata.message : String(hata)}
        </p>
      </main>
    );
  }

  return (
    <main className="kullanim-sayfasi">
      <h1>Kullanım Özeti</h1>
      {ozet.length === 0 ? (
        <p>Henüz kayıtlı kullanım yok.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Kullanıcı</th>
              <th>İstek Sayısı</th>
              <th>Toplam Maliyet</th>
            </tr>
          </thead>
          <tbody>
            {ozet.map((satir) => (
              <tr key={satir.kullaniciAdi}>
                <td>{satir.kullaniciAdi}</td>
                <td>{satir.istekSayisi}</td>
                <td>${satir.toplamMaliyetUsd.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
