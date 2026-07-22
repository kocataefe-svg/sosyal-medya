import { dosyaOku } from "./github";
import { modBul, type ModAdi } from "./modTanimlari";
import { hesaplariGetir } from "./hesaplariGetir";

export async function sistemTalimatiOlustur(ad: ModAdi, hesapId: string | null): Promise<string> {
  const mod = modBul(ad);
  const parcalar: string[] = [];

  const kokTalimat = await dosyaOku("CLAUDE.md");
  if (kokTalimat) parcalar.push(kokTalimat);

  for (const ajanYolu of mod.ajanDosyalari) {
    const ajanIcerik = await dosyaOku(ajanYolu);
    if (ajanIcerik) parcalar.push(ajanIcerik);
  }

  const komutIcerik = await dosyaOku(mod.komutDosyasi);
  if (komutIcerik) parcalar.push(komutIcerik);

  if (hesapId) {
    const hesaplar = await hesaplariGetir();
    const hesap = hesaplar.find((h) => h.id === hesapId);
    if (hesap) {
      const profilIcerik = await dosyaOku(hesap.profilDosyasi);
      if (profilIcerik) {
        parcalar.push(`## Aktif Hesap Profili (${hesap.ad})\n\n${profilIcerik}`);
      }
    }
  }

  parcalar.push(
    "Bu ekipte web tabanlı bir sohbet arayüzünden çalışıyorsun. read_file ve write_file araçlarını " +
      "kullanarak depodaki dosyaları okuyup yazabilirsin (yollar depo köküne göredir, örn. " +
      "'planlar/2026-07-19-restoran-haftalik-plan.md'). web_search aracıyla güncel bilgiye ulaşabilirsin. " +
      "Chrome ile hesaba doğrudan bakamazsın, görsel/video üretemezsin — bu durumda kullanıcıya PC'deki " +
      "tam ekibi kullanmasını öner."
  );

  return parcalar.join("\n\n---\n\n");
}
