import { describe, it, expect } from "vitest";
import { modBul, hesabiBul, MODLAR, HESAPLAR } from "./modTanimlari";

describe("modTanimlari", () => {
  it("bilinen modu bulur", () => {
    expect(modBul("analiz").baslik).toBe("Hesap Analizi");
  });

  it("bilinmeyen mod hata firlatir", () => {
    // @ts-expect-error kasitli gecersiz deger
    expect(() => modBul("yok")).toThrow();
  });

  it("tum modlarin komut dosyasi tanimli", () => {
    for (const mod of MODLAR) {
      expect(mod.komutDosyasi.length).toBeGreaterThan(0);
    }
  });

  it("bilinen hesabi bulur", () => {
    expect(hesabiBul("restoran")?.profilDosyasi).toBe("profiller/restoran-instagram.md");
  });

  it("bilinmeyen hesap icin null doner", () => {
    expect(hesabiBul("yok")).toBeNull();
  });

  it("tum hesaplarin profil dosyasi tanimli", () => {
    for (const hesap of HESAPLAR) {
      expect(hesap.profilDosyasi.length).toBeGreaterThan(0);
    }
  });
});
