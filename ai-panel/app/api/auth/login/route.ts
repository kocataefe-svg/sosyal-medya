import { NextRequest, NextResponse } from "next/server";
import { kullaniciyiBul, sifreDogrula, oturumTokeniOlustur } from "../../../../lib/auth";

export async function POST(istek: NextRequest) {
  const govde = (await istek.json().catch(() => null)) as
    | { kullaniciAdi?: string; sifre?: string }
    | null;
  if (!govde?.kullaniciAdi || !govde?.sifre) {
    return NextResponse.json({ hata: "Kullanıcı adı ve şifre gerekli." }, { status: 400 });
  }

  const kullanici = kullaniciyiBul(govde.kullaniciAdi);
  if (!kullanici) {
    return NextResponse.json({ hata: "Kullanıcı adı veya şifre hatalı." }, { status: 401 });
  }

  const dogruMu = await sifreDogrula(govde.sifre, kullanici.sifreHash);
  if (!dogruMu) {
    return NextResponse.json({ hata: "Kullanıcı adı veya şifre hatalı." }, { status: 401 });
  }

  const token = await oturumTokeniOlustur({
    kullaniciAdi: kullanici.kullaniciAdi,
    sahipMi: kullanici.sahipMi,
  });

  const yanit = NextResponse.json({ basarili: true });
  yanit.cookies.set("oturum", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return yanit;
}
