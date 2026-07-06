// Vitrin paneli: data.json'u okur, kategorileri ve dosyaları gösterir.
const IKONLAR = { planlar: "🗓️", raporlar: "📊", icerikler: "✍️", profiller: "👤" };

let veri = null;
let aktifKategori = "planlar";

const listeEl = document.getElementById("liste");
const sekmelerEl = document.getElementById("sekmeler");
const detayEl = document.getElementById("detay");
const detayIcerikEl = document.getElementById("detay-icerik");
const detayTarihEl = document.getElementById("detay-tarih");
const guncellemeEl = document.getElementById("guncelleme");

document.getElementById("geri").addEventListener("click", () => {
  detayEl.classList.add("gizli");
  document.body.style.overflow = "";
});

function ozetCikar(md) {
  return md
    .replace(/^#.+$/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/[*_`#|\-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
}

function tarihFormatla(iso) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("tr-TR", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch { return iso; }
}

function sekmeleriCiz() {
  sekmelerEl.innerHTML = "";
  for (const kat of veri.kategoriler) {
    const btn = document.createElement("button");
    btn.className = "sekme" + (kat.id === aktifKategori ? " aktif" : "");
    btn.innerHTML = `<span class="ikon">${IKONLAR[kat.id] || "📄"}</span>${kat.ad}` +
      (kat.dosyalar.length ? `<span class="sayi">${kat.dosyalar.length}</span>` : "");
    btn.addEventListener("click", () => {
      aktifKategori = kat.id;
      sekmeleriCiz();
      listeyiCiz();
    });
    sekmelerEl.appendChild(btn);
  }
}

function listeyiCiz() {
  const kat = veri.kategoriler.find((k) => k.id === aktifKategori);
  listeEl.innerHTML = "";
  if (!kat || kat.dosyalar.length === 0) {
    listeEl.innerHTML = `<div class="bos"><span class="ikon">${IKONLAR[aktifKategori] || "📄"}</span>
      Burada henüz bir şey yok.<br/>Ekip ${kat ? kat.ad.toLowerCase() : "içerik"} ürettikçe burada görünecek.</div>`;
    return;
  }
  for (const d of kat.dosyalar) {
    const kart = document.createElement("div");
    kart.className = "kart";
    kart.innerHTML = `
      <h2>${d.baslik}</h2>
      <div class="alt">
        <span class="tarih-rozet">${tarihFormatla(d.tarih)}</span>
        ${d.etiket ? `<span class="etiket-rozet">${d.etiket}</span>` : ""}
      </div>
      <p class="ozet">${ozetCikar(d.icerik)}</p>`;
    kart.addEventListener("click", () => detayAc(d));
    listeEl.appendChild(kart);
  }
}

function detayAc(d) {
  detayTarihEl.textContent = tarihFormatla(d.tarih);
  if (window.marked) {
    detayIcerikEl.innerHTML = marked.parse(d.icerik);
  } else {
    const pre = document.createElement("pre");
    pre.style.whiteSpace = "pre-wrap";
    pre.textContent = d.icerik;
    detayIcerikEl.innerHTML = "";
    detayIcerikEl.appendChild(pre);
  }
  detayEl.classList.remove("gizli");
  detayEl.scrollTop = 0;
  document.body.style.overflow = "hidden";
}

fetch("data.json")
  .then((r) => {
    if (!r.ok) throw new Error("data.json bulunamadı");
    return r.json();
  })
  .then((d) => {
    veri = d;
    const t = new Date(d.olusturulma);
    guncellemeEl.textContent = "Son güncelleme: " + t.toLocaleDateString("tr-TR", {
      day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
    });
    sekmeleriCiz();
    listeyiCiz();
  })
  .catch(() => {
    listeEl.innerHTML = `<div class="bos"><span class="ikon">⚠️</span>
      Veri dosyası bulunamadı.<br/>Depo kökünde <code>node panel/build.js</code> çalıştırın.</div>`;
  });
