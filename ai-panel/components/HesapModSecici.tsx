"use client";

import { MODLAR } from "../lib/modTanimlari";
import type { HesapTanimi } from "../lib/modTanimlari";

interface Props {
  hesaplar: HesapTanimi[];
  seciliMod: string;
  seciliHesap: string;
  modDegisti: (mod: string) => void;
  hesapDegisti: (hesap: string) => void;
}

export default function HesapModSecici({
  hesaplar,
  seciliMod,
  seciliHesap,
  modDegisti,
  hesapDegisti,
}: Props) {
  return (
    <div className="hesap-mod-secici">
      <select value={seciliHesap} onChange={(e) => hesapDegisti(e.target.value)}>
        {hesaplar.map((hesap) => (
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
