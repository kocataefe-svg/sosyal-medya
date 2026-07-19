// Vitrin paneli veri derleyici: markdown klasörlerini tarar, panel/data.json üretir.
// Kullanım: node panel/build.js  (depo kökünden)
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(__dirname, "data.json");

const KATEGORILER = [
  { id: "planlar", ad: "Planlar", klasor: "planlar" },
  { id: "raporlar", ad: "Raporlar", klasor: "raporlar" },
  { id: "icerikler", ad: "İçerikler", klasor: "icerikler" },
  { id: "profiller", ad: "Profiller", klasor: "profiller" },
];

function mdDosyalariniTara(dizin) {
  if (!fs.existsSync(dizin)) return [];
  const sonuc = [];
  for (const giris of fs.readdirSync(dizin, { withFileTypes: true })) {
    const tam = path.join(dizin, giris.name);
    if (giris.isDirectory()) {
      sonuc.push(...mdDosyalariniTara(tam));
    } else if (giris.name.toLowerCase().endsWith(".md")) {
      sonuc.push(tam);
    }
  }
  return sonuc;
}

function baslikCikar(icerik, dosyaAdi) {
  const m = icerik.match(/^#\s+(.+)$/m);
  if (m) return m[1].trim();
  return dosyaAdi.replace(/\.md$/i, "").replace(/-/g, " ");
}

function tarihCikar(dosyaAdi, tamYol) {
  const m = dosyaAdi.match(/(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  return fs.statSync(tamYol).mtime.toISOString().slice(0, 10);
}

// "YYYY-AA-GG-[hesap]-haftalik-plan.md" adından hesap slug'ını çıkarır
function haftalikPlanHesabi(dosyaAdi) {
  const m = dosyaAdi.match(/^\d{4}-\d{2}-\d{2}-(.+)-haftalik-plan\.md$/i);
  return m ? m[1] : null;
}

const veri = { olusturulma: new Date().toISOString(), kategoriler: [], buHafta: [] };

for (const kat of KATEGORILER) {
  const klasorYolu = path.join(ROOT, kat.klasor);
  const dosyalar = mdDosyalariniTara(klasorYolu).map((tamYol) => {
    const icerik = fs.readFileSync(tamYol, "utf8");
    const dosyaAdi = path.basename(tamYol);
    // Alt klasör adı (örn. icerikler/restoran/...) etiket olarak kullanılır
    const gorece = path.relative(klasorYolu, tamYol);
    const altKlasor = path.dirname(gorece);
    return {
      dosya: dosyaAdi,
      etiket: altKlasor === "." ? null : altKlasor,
      baslik: baslikCikar(icerik, dosyaAdi),
      tarih: tarihCikar(dosyaAdi, tamYol),
      icerik,
    };
  });
  dosyalar.sort((a, b) => b.tarih.localeCompare(a.tarih));
  veri.kategoriler.push({ id: kat.id, ad: kat.ad, dosyalar });
}

// "Bu Hafta" paneli: her hesap için en güncel haftalık planı öne çıkar
const planlarKat = veri.kategoriler.find((k) => k.id === "planlar");
if (planlarKat) {
  const gorulenHesaplar = new Set();
  for (const d of planlarKat.dosyalar) {
    const hesap = haftalikPlanHesabi(d.dosya);
    if (!hesap || gorulenHesaplar.has(hesap)) continue;
    gorulenHesaplar.add(hesap);
    veri.buHafta.push({ hesap, ...d });
  }
}

fs.writeFileSync(OUT, JSON.stringify(veri, null, 2), "utf8");
const toplam = veri.kategoriler.reduce((t, k) => t + k.dosyalar.length, 0);
console.log(`data.json üretildi: ${toplam} dosya, ${veri.kategoriler.length} kategori, ${veri.buHafta.length} güncel haftalık plan`);
