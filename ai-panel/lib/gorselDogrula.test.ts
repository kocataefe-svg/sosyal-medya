import { describe, it, expect } from "vitest";
import { gorselListesiGecerliMi, MAKSIMUM_GORSEL_SAYISI } from "./gorselDogrula";
import type { SohbetGorseli } from "./types";

function ornekGorsel(mediaType: SohbetGorseli["mediaType"] = "image/jpeg"): SohbetGorseli {
  return { mediaType, data: "aGVsbG8=" };
}

describe("gorselDogrula", () => {
  it("bos listeyi gecerli sayar", () => {
    expect(gorselListesiGecerliMi([])).toEqual({ gecerli: true });
  });

  it("sinir icindeki gorsel sayisini gecerli sayar", () => {
    const gorseller = Array.from({ length: MAKSIMUM_GORSEL_SAYISI }, () => ornekGorsel());
    expect(gorselListesiGecerliMi(gorseller)).toEqual({ gecerli: true });
  });

  it("sinir asan gorsel sayisini reddeder", () => {
    const gorseller = Array.from({ length: MAKSIMUM_GORSEL_SAYISI + 1 }, () => ornekGorsel());
    const sonuc = gorselListesiGecerliMi(gorseller);
    expect(sonuc.gecerli).toBe(false);
    expect(sonuc.hata).toContain(String(MAKSIMUM_GORSEL_SAYISI));
  });

  it("gecerli media tiplerini kabul eder", () => {
    expect(gorselListesiGecerliMi([ornekGorsel("image/jpeg")]).gecerli).toBe(true);
    expect(gorselListesiGecerliMi([ornekGorsel("image/png")]).gecerli).toBe(true);
    expect(gorselListesiGecerliMi([ornekGorsel("image/webp")]).gecerli).toBe(true);
  });

  it("gecersiz media tipini reddeder", () => {
    const gorsel = { mediaType: "image/gif", data: "aGVsbG8=" } as unknown as SohbetGorseli;
    const sonuc = gorselListesiGecerliMi([gorsel]);
    expect(sonuc.gecerli).toBe(false);
    expect(sonuc.hata).toContain("image/gif");
  });

  it("bos veriyi reddeder", () => {
    const gorsel: SohbetGorseli = { mediaType: "image/jpeg", data: "" };
    const sonuc = gorselListesiGecerliMi([gorsel]);
    expect(sonuc.gecerli).toBe(false);
  });
});
