import type { SohbetGorseli } from "./types";

export const MAKSIMUM_GORSEL_SAYISI = 4;
export const GECERLI_MEDIA_TIPLERI = ["image/jpeg", "image/png", "image/webp"] as const;

export interface GorselDogrulamaSonucu {
  gecerli: boolean;
  hata?: string;
}

export function gorselListesiGecerliMi(gorseller: SohbetGorseli[]): GorselDogrulamaSonucu {
  if (gorseller.length > MAKSIMUM_GORSEL_SAYISI) {
    return {
      gecerli: false,
      hata: `En fazla ${MAKSIMUM_GORSEL_SAYISI} görsel gönderebilirsin.`,
    };
  }

  for (const gorsel of gorseller) {
    if (!GECERLI_MEDIA_TIPLERI.includes(gorsel.mediaType as (typeof GECERLI_MEDIA_TIPLERI)[number])) {
      return { gecerli: false, hata: `Desteklenmeyen görsel tipi: ${gorsel.mediaType}` };
    }
    if (!gorsel.data) {
      return { gecerli: false, hata: "Görsel verisi boş olamaz." };
    }
  }

  return { gecerli: true };
}
