export interface SohbetGorseli {
  mediaType: "image/jpeg" | "image/png" | "image/webp";
  data: string;
}

export interface SohbetMesaji {
  rol: "user" | "assistant";
  icerik: string;
  gorseller?: SohbetGorseli[];
}
