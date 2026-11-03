#!/usr/bin/env node
// Instagram API (Instagram Login) ile hesap verisini çeker ve veri/instagram/YYYY-AA-GG.json olarak kaydeder.
// Gerekli: IG_ACCESS_TOKEN ortam değişkeni (instagram_business_basic + instagram_business_manage_insights izinli).
// Ağ: graph.instagram.com erişimi açık olmalı. Sadece OKUMA yapar; hesapta hiçbir işlem yapmaz.
//
// Kullanım: node scripts/instagram-veri.mjs [--gonderi-sayisi 15]
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const TOKEN = process.env.IG_ACCESS_TOKEN;
const SURUM = process.env.IG_API_VERSION || "v23.0";
const TABAN = `https://graph.instagram.com/${SURUM}`;

if (!TOKEN) {
  console.error("IG_ACCESS_TOKEN yok. Proje ayarları → cloud environment → gizli değişken olarak ekle.");
  process.exit(2);
}

const argIdx = process.argv.indexOf("--gonderi-sayisi");
const GONDERI_SAYISI = argIdx > -1 ? Number(process.argv[argIdx + 1]) || 15 : 15;

async function getir(yol, params = {}) {
  const url = new URL(`${TABAN}/${yol}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("access_token", TOKEN);
  const res = await fetch(url);
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) {
    const mesaj = json.error?.message || `HTTP ${res.status}`;
    throw new Error(`${yol}: ${mesaj}`);
  }
  return json;
}

// Hata veren tek bir metrik tüm çalıştırmayı düşürmesin.
async function guvenli(etiket, fn, hatalar) {
  try {
    return await fn();
  } catch (e) {
    hatalar.push(`${etiket}: ${e.message}`);
    return null;
  }
}

function toplamDegerler(json) {
  const sonuc = {};
  for (const m of json?.data || []) {
    sonuc[m.name] = m.total_value?.value ?? m.values?.at(-1)?.value ?? null;
  }
  return sonuc;
}

const hatalar = [];
const bugun = new Date().toISOString().slice(0, 10);
const simdi = Math.floor(Date.now() / 1000);
const yediGunOnce = simdi - 7 * 24 * 3600;

const hesap = await getir("me", {
  fields: "user_id,username,name,followers_count,follows_count,media_count",
});

const haftalik = await guvenli("hesap-insights", async () =>
  toplamDegerler(
    await getir("me/insights", {
      metric: "reach,views,accounts_engaged,total_interactions,profile_views,website_clicks,follows_and_unfollows",
      period: "day",
      metric_type: "total_value",
      since: String(yediGunOnce),
      until: String(simdi),
    })
  ), hatalar);

const demografi = {};
for (const kirilim of ["country", "city", "age"]) {
  demografi[kirilim] = await guvenli(`demografi-${kirilim}`, async () => {
    const j = await getir("me/insights", {
      metric: "follower_demographics",
      period: "lifetime",
      metric_type: "total_value",
      breakdown: kirilim,
    });
    const sonuclar = j.data?.[0]?.total_value?.breakdowns?.[0]?.results || [];
    return Object.fromEntries(sonuclar.map((r) => [r.dimension_values.join("/"), r.value]));
  }, hatalar);
}

const medya = await getir("me/media", {
  fields: "id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count",
  limit: String(GONDERI_SAYISI),
});

const gonderiler = [];
for (const m of medya.data || []) {
  const reelsMi = m.media_product_type === "REELS";
  const metrikler = reelsMi
    ? "reach,views,saved,shares,total_interactions,ig_reels_avg_watch_time"
    : m.media_product_type === "STORY"
      ? "reach,views,replies,navigation"
      : "reach,views,saved,shares,total_interactions";
  const insights = await guvenli(`gonderi-${m.id}`, async () =>
    toplamDegerler(await getir(`${m.id}/insights`, { metric: metrikler })), hatalar);
  gonderiler.push({
    id: m.id,
    tarih: m.timestamp,
    tip: m.media_product_type || m.media_type,
    link: m.permalink,
    caption_basi: (m.caption || "").split("\n")[0].slice(0, 120),
    begeni: m.like_count ?? null,
    yorum: m.comments_count ?? null,
    ...(insights || {}),
  });
}

const kayit = {
  tarih: bugun,
  hesap: {
    kullanici_adi: hesap.username,
    takipci: hesap.followers_count,
    takip_edilen: hesap.follows_count,
    gonderi_sayisi: hesap.media_count,
  },
  son_7_gun: haftalik,
  takipci_demografisi: demografi,
  gonderiler,
  hatalar,
};

const klasor = path.join("veri", "instagram");
await mkdir(klasor, { recursive: true });
const dosya = path.join(klasor, `${bugun}.json`);
await writeFile(dosya, JSON.stringify(kayit, null, 2) + "\n");
console.log(`Kaydedildi: ${dosya} — takipçi ${hesap.followers_count}, ${gonderiler.length} gönderi, ${hatalar.length} metrik hatası`);
if (hatalar.length) console.log("Uyarılar:\n- " + hatalar.join("\n- "));
