import { describe, it, expect } from "vitest";
import { modBul, MODLAR } from "./modTanimlari";

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
});
