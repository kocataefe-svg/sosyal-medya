import { describe, it, expect } from "vitest";
import { istekIcinMesajlariHazirla } from "./istekIcinMesajlariHazirla";
import type { SohbetMesaji } from "./types";

describe("istekIcinMesajlariHazirla", () => {
  it("eski mesajlardaki gorselleri kaldirir, son mesajinkini korur", () => {
    const mesajlar: SohbetMesaji[] = [
      {
        rol: "user",
        icerik: "ilk tur",
        gorseller: [{ mediaType: "image/jpeg", data: "eskiVeri1" }],
      },
      { rol: "assistant", icerik: "ilk cevap" },
      {
        rol: "user",
        icerik: "ikinci tur",
        gorseller: [{ mediaType: "image/jpeg", data: "yeniVeri" }],
      },
    ];

    const sonuc = istekIcinMesajlariHazirla(mesajlar);

    expect(sonuc[0]).toEqual({ rol: "user", icerik: "ilk tur" });
    expect(sonuc[1]).toEqual({ rol: "assistant", icerik: "ilk cevap" });
    expect(sonuc[2]).toEqual({
      rol: "user",
      icerik: "ikinci tur",
      gorseller: [{ mediaType: "image/jpeg", data: "yeniVeri" }],
    });
  });

  it("tek mesajli listede gorseli korur", () => {
    const mesajlar: SohbetMesaji[] = [
      {
        rol: "user",
        icerik: "tek tur",
        gorseller: [{ mediaType: "image/jpeg", data: "veri" }],
      },
    ];

    const sonuc = istekIcinMesajlariHazirla(mesajlar);

    expect(sonuc).toEqual(mesajlar);
  });

  it("bos listede bos dizi doner", () => {
    expect(istekIcinMesajlariHazirla([])).toEqual([]);
  });

  it("gorseli olmayan mesajlari degistirmez", () => {
    const mesajlar: SohbetMesaji[] = [
      { rol: "user", icerik: "merhaba" },
      { rol: "assistant", icerik: "selam" },
    ];

    const sonuc = istekIcinMesajlariHazirla(mesajlar);

    expect(sonuc).toEqual(mesajlar);
  });

  it("orijinal diziyi degistirmez (yeni dizi doner)", () => {
    const mesajlar: SohbetMesaji[] = [
      {
        rol: "user",
        icerik: "tur",
        gorseller: [{ mediaType: "image/jpeg", data: "veri" }],
      },
      { rol: "user", icerik: "ikinci", gorseller: [{ mediaType: "image/png", data: "veri2" }] },
    ];

    istekIcinMesajlariHazirla(mesajlar);

    expect(mesajlar[0].gorseller).toEqual([{ mediaType: "image/jpeg", data: "veri" }]);
  });
});
