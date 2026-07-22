"use client";

import { useState } from "react";
import HesapModSecici from "./HesapModSecici";
import MesajBalonu from "./MesajBalonu";
import { gorselListesiGecerliMi, MAKSIMUM_GORSEL_SAYISI } from "../lib/gorselDogrula";
import { istekIcinMesajlariHazirla } from "../lib/istekIcinMesajlariHazirla";
import type { SohbetMesaji, SohbetGorseli } from "../lib/types";

const MAKSIMUM_UZUN_KENAR = 1568;
const JPEG_KALITE = 0.8;

async function gorseliKucult(dosya: File): Promise<SohbetGorseli> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const okuyucu = new FileReader();
    okuyucu.onload = () => resolve(okuyucu.result as string);
    okuyucu.onerror = () => reject(new Error("Dosya okunamadı."));
    okuyucu.readAsDataURL(dosya);
  });

  const resim = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("Görsel okunamadı — desteklenmeyen format olabilir, JPEG/PNG deneyin."));
    img.src = dataUrl;
  });

  let genislik = resim.width;
  let yukseklik = resim.height;
  const uzunKenar = Math.max(genislik, yukseklik);
  if (uzunKenar > MAKSIMUM_UZUN_KENAR) {
    const oran = MAKSIMUM_UZUN_KENAR / uzunKenar;
    genislik = Math.round(genislik * oran);
    yukseklik = Math.round(yukseklik * oran);
  }

  const tuval = document.createElement("canvas");
  tuval.width = genislik;
  tuval.height = yukseklik;
  const baglam = tuval.getContext("2d");
  if (!baglam) throw new Error("Görsel işlenemedi.");
  baglam.drawImage(resim, 0, 0, genislik, yukseklik);

  const sikistirilmisDataUrl = tuval.toDataURL("image/jpeg", JPEG_KALITE);
  const base64Veri = sikistirilmisDataUrl.split(",")[1];

  return { mediaType: "image/jpeg", data: base64Veri };
}

export default function SohbetEkrani() {
  const [seciliHesap, setSeciliHesap] = useState("restoran");
  const [seciliMod, setSeciliMod] = useState("analiz");
  const [mesajlar, setMesajlar] = useState<SohbetMesaji[]>([]);
  const [girdi, setGirdi] = useState("");
  const [seciliGorseller, setSeciliGorseller] = useState<SohbetGorseli[]>([]);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);

  async function gorselSecildi(e: React.ChangeEvent<HTMLInputElement>) {
    const dosyalar = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (dosyalar.length === 0) return;

    setHata(null);
    try {
      const yeniGorseller = await Promise.all(dosyalar.map(gorseliKucult));
      const birlesikGorseller = [...seciliGorseller, ...yeniGorseller];
      const dogrulama = gorselListesiGecerliMi(birlesikGorseller);
      if (!dogrulama.gecerli) {
        setHata(dogrulama.hata ?? "Görsel eklenemedi.");
        return;
      }
      setSeciliGorseller(birlesikGorseller);
    } catch (islenmeHatasi) {
      setHata(
        islenmeHatasi instanceof Error ? islenmeHatasi.message : "Görsel işlenirken bir hata oluştu."
      );
    }
  }

  function gorseliKaldir(index: number) {
    setSeciliGorseller(seciliGorseller.filter((_, i) => i !== index));
  }

  async function mesajGonder(e: React.FormEvent) {
    e.preventDefault();
    const metin = girdi.trim();
    if ((!metin && seciliGorseller.length === 0) || gonderiliyor) return;

    const yeniMesaj: SohbetMesaji = {
      rol: "user",
      icerik: metin,
      ...(seciliGorseller.length > 0 ? { gorseller: seciliGorseller } : {}),
    };
    const yeniMesajlar: SohbetMesaji[] = [...mesajlar, yeniMesaj];
    setMesajlar(yeniMesajlar);
    setGirdi("");
    setSeciliGorseller([]);
    setGonderiliyor(true);
    setHata(null);

    try {
      const yanit = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mod: seciliMod,
          hesap: seciliHesap,
          mesajlar: istekIcinMesajlariHazirla(yeniMesajlar),
        }),
      });
      const govde = await yanit.json();
      if (!yanit.ok) {
        setHata(govde.hata || "Bir hata oluştu.");
        return;
      }
      setMesajlar([...yeniMesajlar, { rol: "assistant", icerik: govde.cevap }]);
    } catch {
      setHata("Sunucuya ulaşılamadı, tekrar deneyin.");
    } finally {
      setGonderiliyor(false);
    }
  }

  return (
    <div className="sohbet-ekrani">
      <HesapModSecici
        seciliMod={seciliMod}
        seciliHesap={seciliHesap}
        modDegisti={setSeciliMod}
        hesapDegisti={setSeciliHesap}
      />
      <div className="mesaj-listesi">
        {mesajlar.length === 0 && (
          <p className="bos-mesaj">Hesap ve mod seç, sonra yazmaya başla.</p>
        )}
        {mesajlar.map((mesaj, i) => (
          <MesajBalonu key={i} mesaj={mesaj} />
        ))}
        {gonderiliyor && <div className="mesaj-balonu asistan yukleniyor">Yazıyor...</div>}
      </div>
      {hata && <p className="hata-mesaji">{hata}</p>}
      {seciliGorseller.length > 0 && (
        <div className="gorsel-onizleme-seridi">
          {seciliGorseller.map((gorsel, i) => (
            <div className="gorsel-onizleme" key={i}>
              <img src={`data:${gorsel.mediaType};base64,${gorsel.data}`} alt="Seçilen görsel" />
              <button
                type="button"
                className="gorsel-kaldir-buton"
                onClick={() => gorseliKaldir(i)}
                aria-label="Görseli kaldır"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={mesajGonder} className="mesaj-formu">
        <label className="gorsel-ekle-buton" aria-label="Görsel ekle">
          📎
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={gorselSecildi}
            disabled={seciliGorseller.length >= MAKSIMUM_GORSEL_SAYISI}
          />
        </label>
        <textarea
          value={girdi}
          onChange={(e) => setGirdi(e.target.value)}
          placeholder="Mesajını yaz..."
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              mesajGonder(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={gonderiliyor || (!girdi.trim() && seciliGorseller.length === 0)}
        >
          Gönder
        </button>
      </form>
    </div>
  );
}
