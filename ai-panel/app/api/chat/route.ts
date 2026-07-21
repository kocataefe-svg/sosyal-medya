import { NextRequest, NextResponse } from "next/server";
import { oturumTokeniDogrula } from "../../../lib/auth";
import { sistemTalimatiOlustur } from "../../../lib/sistemTalimati";
import { sohbetIstegiGonder } from "../../../lib/claude";
import { kullanimKaydet } from "../../../lib/kullanimKaydi";
import { gorselListesiGecerliMi } from "../../../lib/gorselDogrula";
import type { ModAdi } from "../../../lib/modTanimlari";
import type { SohbetMesaji } from "../../../lib/types";

interface SohbetIstegi {
  mod: ModAdi;
  hesap: string | null;
  mesajlar: SohbetMesaji[];
}

export async function POST(istek: NextRequest) {
  const token = istek.cookies.get("oturum")?.value;
  const oturum = token ? await oturumTokeniDogrula(token) : null;
  if (!oturum) {
    return NextResponse.json({ hata: "Oturum bulunamadı, tekrar giriş yapın." }, { status: 401 });
  }

  const govde = (await istek.json().catch(() => null)) as SohbetIstegi | null;
  if (!govde?.mod || !Array.isArray(govde.mesajlar)) {
    return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 });
  }

  for (const mesaj of govde.mesajlar) {
    if (mesaj.gorseller?.length) {
      const dogrulama = gorselListesiGecerliMi(mesaj.gorseller);
      if (!dogrulama.gecerli) {
        return NextResponse.json({ hata: dogrulama.hata }, { status: 400 });
      }
    }
  }

  try {
    const sistemTalimati = await sistemTalimatiOlustur(govde.mod, govde.hesap ?? null);
    const sonuc = await sohbetIstegiGonder({
      sistemTalimati,
      mesajlar: govde.mesajlar,
    });

    // Kullanım kaydı yazılamazsa (örn. Redis henüz kurulmadıysa) sohbet
    // cevabını yine de döndür — bu ikincil bir özellik, sohbeti kesmemeli.
    try {
      await kullanimKaydet({
        kullaniciAdi: oturum.kullaniciAdi,
        mod: govde.mod,
        model: process.env.CLAUDE_MODEL || "claude-haiku-4-5",
        girdiToken: sonuc.girdiTokenSayisi,
        ciktiToken: sonuc.ciktiTokenSayisi,
        maliyetUsd: sonuc.tahminiMaliyetUsd,
        zaman: new Date().toISOString(),
      });
    } catch (kayitHatasi) {
      console.error("Kullanım kaydı yazılamadı:", kayitHatasi);
    }

    return NextResponse.json({ cevap: sonuc.cevap });
  } catch (hata) {
    console.error("Sohbet isteği hatası:", hata);
    return NextResponse.json(
      { hata: hata instanceof Error ? hata.message : "Bilinmeyen bir hata oluştu." },
      { status: 500 }
    );
  }
}
