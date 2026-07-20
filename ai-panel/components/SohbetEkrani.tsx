"use client";

import { useState } from "react";
import HesapModSecici from "./HesapModSecici";
import MesajBalonu from "./MesajBalonu";
import type { SohbetMesaji } from "../lib/types";

export default function SohbetEkrani() {
  const [seciliHesap, setSeciliHesap] = useState("restoran");
  const [seciliMod, setSeciliMod] = useState("analiz");
  const [mesajlar, setMesajlar] = useState<SohbetMesaji[]>([]);
  const [girdi, setGirdi] = useState("");
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);

  async function mesajGonder(e: React.FormEvent) {
    e.preventDefault();
    const metin = girdi.trim();
    if (!metin || gonderiliyor) return;

    const yeniMesajlar: SohbetMesaji[] = [...mesajlar, { rol: "user", icerik: metin }];
    setMesajlar(yeniMesajlar);
    setGirdi("");
    setGonderiliyor(true);
    setHata(null);

    try {
      const yanit = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mod: seciliMod, hesap: seciliHesap, mesajlar: yeniMesajlar }),
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
      <form onSubmit={mesajGonder} className="mesaj-formu">
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
        <button type="submit" disabled={gonderiliyor || !girdi.trim()}>
          Gönder
        </button>
      </form>
    </div>
  );
}
