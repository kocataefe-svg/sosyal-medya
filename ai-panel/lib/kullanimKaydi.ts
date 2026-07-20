import { createClient, type RedisClientType } from "redis";

export interface KullanimKaydi {
  kullaniciAdi: string;
  mod: string;
  model: string;
  girdiToken: number;
  ciktiToken: number;
  maliyetUsd: number;
  zaman: string;
}

const KV_ANAHTARI = "ai-panel:kullanim-kayitlari";

let istemci: RedisClientType | null = null;
let baglantiPromise: Promise<RedisClientType> | null = null;

function istemciyiGetir(): Promise<RedisClientType> {
  if (!baglantiPromise) {
    const url = process.env.REDIS_URL;
    if (!url) throw new Error("REDIS_URL ortam değişkeni tanımlı değil");
    istemci = createClient({ url }) as RedisClientType;
    baglantiPromise = istemci.connect().then(() => istemci as RedisClientType);
  }
  return baglantiPromise;
}

export async function kullanimKaydet(kayit: KullanimKaydi): Promise<void> {
  const client = await istemciyiGetir();
  await client.rPush(KV_ANAHTARI, JSON.stringify(kayit));
}

export interface KullaniciOzeti {
  kullaniciAdi: string;
  toplamMaliyetUsd: number;
  istekSayisi: number;
}

export async function kullanimOzetiGetir(): Promise<KullaniciOzeti[]> {
  const client = await istemciyiGetir();
  const hamKayitlar = (await client.lRange(KV_ANAHTARI, 0, -1)) ?? [];
  const kayitlar: KullanimKaydi[] = hamKayitlar.map((satir) =>
    typeof satir === "string" ? JSON.parse(satir) : (satir as unknown as KullanimKaydi)
  );

  const ozetMap = new Map<string, KullaniciOzeti>();
  for (const kayit of kayitlar) {
    const mevcut = ozetMap.get(kayit.kullaniciAdi) ?? {
      kullaniciAdi: kayit.kullaniciAdi,
      toplamMaliyetUsd: 0,
      istekSayisi: 0,
    };
    mevcut.toplamMaliyetUsd += kayit.maliyetUsd;
    mevcut.istekSayisi += 1;
    ozetMap.set(kayit.kullaniciAdi, mevcut);
  }

  return Array.from(ozetMap.values()).sort((a, b) => b.toplamMaliyetUsd - a.toplamMaliyetUsd);
}
