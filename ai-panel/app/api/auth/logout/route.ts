import { NextResponse } from "next/server";

export async function POST() {
  const yanit = NextResponse.json({ basarili: true });
  yanit.cookies.set("oturum", "", { httpOnly: true, path: "/", maxAge: 0 });
  return yanit;
}
