import { NextRequest, NextResponse } from "next/server";
import { oturumTokeniDogrula } from "./lib/auth";

const KORUNAN_SAYFALAR = ["/", "/kullanim"];
const KORUNAN_API_ROTALARI = ["/api/chat", "/api/kullanim"];

export async function middleware(istek: NextRequest) {
  const { pathname } = istek.nextUrl;
  const korunanSayfaMi = KORUNAN_SAYFALAR.includes(pathname);
  const korunanApiMi = KORUNAN_API_ROTALARI.some((yol) => pathname.startsWith(yol));

  if (!korunanSayfaMi && !korunanApiMi) {
    return NextResponse.next();
  }

  const token = istek.cookies.get("oturum")?.value;
  const oturum = token ? await oturumTokeniDogrula(token) : null;

  if (!oturum) {
    if (korunanApiMi) {
      return NextResponse.json({ hata: "Oturum bulunamadı." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", istek.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/kullanim", "/api/chat", "/api/kullanim"],
};
