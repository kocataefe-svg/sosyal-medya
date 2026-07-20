"use client";

import { MODLAR, HESAPLAR } from "../lib/modTanimlari";

interface Props {
  seciliMod: string;
  seciliHesap: string;
  modDegisti: (mod: string) => void;
  hesapDegisti: (hesap: string) => void;
}

export default function HesapModSecici({
  seciliMod,
  seciliHesap,
  modDegisti,
  hesapDegisti,
}: Props) {
  return (
    <div className="hesap-mod-secici">
      <select value={seciliHesap} onChange={(e) => hesapDegisti(e.target.value)}>
        {HESAPLAR.map((hesap) => (
          <option key={hesap.id} value={hesap.id}>
            {hesap.ad}
          </option>
        ))}
      </select>
      <select value={seciliMod} onChange={(e) => modDegisti(e.target.value)}>
        {MODLAR.map((mod) => (
          <option key={mod.ad} value={mod.ad}>
            {mod.baslik}
          </option>
        ))}
      </select>
    </div>
  );
}
