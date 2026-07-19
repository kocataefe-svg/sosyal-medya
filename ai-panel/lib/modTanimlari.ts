export type ModAdi =
  | "analiz"
  | "haftalik-plan"
  | "icerik"
  | "trend"
  | "rakip"
  | "geri-bildirim"
  | "profil-ekle";

export interface ModTanimi {
  ad: ModAdi;
  baslik: string;
  ajanDosyalari: string[];
  komutDosyasi: string;
}

export const MODLAR: ModTanimi[] = [
  {
    ad: "analiz",
    baslik: "Hesap Analizi",
    ajanDosyalari: [".claude/agents/instagram-uzmani.md"],
    komutDosyasi: ".claude/commands/analiz.md",
  },
  {
    ad: "haftalik-plan",
    baslik: "Haftalık İçerik Planı",
    ajanDosyalari: [".claude/agents/instagram-uzmani.md"],
    komutDosyasi: ".claude/commands/haftalik-plan.md",
  },
  {
    ad: "icerik",
    baslik: "İçerik Üretimi",
    ajanDosyalari: [".claude/agents/instagram-uzmani.md"],
    komutDosyasi: ".claude/commands/icerik.md",
  },
  {
    ad: "trend",
    baslik: "Trend Araştırması",
    ajanDosyalari: [".claude/agents/trend-analisti.md"],
    komutDosyasi: ".claude/commands/trend.md",
  },
  {
    ad: "rakip",
    baslik: "Rakip İnceleme",
    ajanDosyalari: [".claude/agents/rakip-analisti.md"],
    komutDosyasi: ".claude/commands/rakip.md",
  },
  {
    ad: "geri-bildirim",
    baslik: "Geri Bildirim",
    ajanDosyalari: [],
    komutDosyasi: ".claude/commands/geri-bildirim.md",
  },
  {
    ad: "profil-ekle",
    baslik: "Yeni Profil Ekle",
    ajanDosyalari: [],
    komutDosyasi: ".claude/commands/profil-ekle.md",
  },
];

export function modBul(ad: ModAdi): ModTanimi {
  const mod = MODLAR.find((m) => m.ad === ad);
  if (!mod) throw new Error(`Bilinmeyen mod: ${ad}`);
  return mod;
}

export interface HesapTanimi {
  id: string;
  ad: string;
  profilDosyasi: string;
}

export const HESAPLAR: HesapTanimi[] = [
  { id: "sahsi", ad: "Şahsi Instagram", profilDosyasi: "profiller/sahsi-instagram.md" },
  { id: "restoran", ad: "Restoran Instagram", profilDosyasi: "profiller/restoran-instagram.md" },
  { id: "youtube", ad: "YouTube Kanalı", profilDosyasi: "profiller/youtube-kanali.md" },
  { id: "maps", ad: "Google Maps", profilDosyasi: "profiller/google-maps.md" },
];

export function hesabiBul(id: string): HesapTanimi | null {
  return HESAPLAR.find((h) => h.id === id) ?? null;
}
