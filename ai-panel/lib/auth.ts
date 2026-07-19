import bcrypt from "bcryptjs";

export interface KullaniciOturumu {
  kullaniciAdi: string;
  sahipMi: boolean;
}

interface KayitliKullanici {
  kullaniciAdi: string;
  sifreHash: string;
  sahipMi: boolean;
}

function base64UrlKodla(metin: string): string {
  const bytes = new TextEncoder().encode(metin);
  let ikili = "";
  for (const bayt of bytes) ikili += String.fromCharCode(bayt);
  return btoa(ikili).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlKodlaBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let ikili = "";
  for (const bayt of bytes) ikili += String.fromCharCode(bayt);
  return btoa(ikili).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlCoz(veri: string): ArrayBuffer {
  const standart = veri.replace(/-/g, "+").replace(/_/g, "/");
  const dolgulu = standart + "=".repeat((4 - (standart.length % 4)) % 4);
  const ikili = atob(dolgulu);
  const bytes = new Uint8Array(ikili.length);
  for (let i = 0; i < ikili.length; i++) bytes[i] = ikili.charCodeAt(i);
  return bytes.buffer;
}

async function hmacAnahtariOlustur(): Promise<CryptoKey> {
  const sir = process.env.SESSION_SECRET;
  if (!sir) throw new Error("SESSION_SECRET ortam değişkeni tanımlı değil");
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(sir),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export function kullanicilariYukle(): KayitliKullanici[] {
  const ham = process.env.AI_PANEL_USERS;
  if (!ham) return [];
  return JSON.parse(ham) as KayitliKullanici[];
}

export function kullaniciyiBul(kullaniciAdi: string): KayitliKullanici | null {
  return kullanicilariYukle().find((k) => k.kullaniciAdi === kullaniciAdi) ?? null;
}

export async function sifreDogrula(duzMetin: string, hash: string): Promise<boolean> {
  return bcrypt.compare(duzMetin, hash);
}

export async function oturumTokeniOlustur(oturum: KullaniciOturumu): Promise<string> {
  const yukBase64 = base64UrlKodla(JSON.stringify(oturum));
  const anahtar = await hmacAnahtariOlustur();
  const imzaBuffer = await crypto.subtle.sign("HMAC", anahtar, new TextEncoder().encode(yukBase64));
  return `${yukBase64}.${base64UrlKodlaBuffer(imzaBuffer)}`;
}

export async function oturumTokeniDogrula(token: string): Promise<KullaniciOturumu | null> {
  const parcalar = token.split(".");
  if (parcalar.length !== 2) return null;
  const [yukBase64, imza] = parcalar;
  try {
    const anahtar = await hmacAnahtariOlustur();
    const imzaBuffer = base64UrlCoz(imza);
    const gecerliMi = await crypto.subtle.verify(
      "HMAC",
      anahtar,
      imzaBuffer,
      new TextEncoder().encode(yukBase64)
    );
    if (!gecerliMi) return null;
    const yuk = JSON.parse(new TextDecoder().decode(base64UrlCoz(yukBase64)));
    if (typeof yuk.kullaniciAdi === "string" && typeof yuk.sahipMi === "boolean") {
      return yuk as KullaniciOturumu;
    }
    return null;
  } catch {
    return null;
  }
}
