import { describe, it, expect, vi, beforeEach } from "vitest";

const { dizinListeleMock, dosyaOkuMock } = vi.hoisted(() => ({
  dizinListeleMock: vi.fn(),
  dosyaOkuMock: vi.fn(),
}));

vi.mock("./github", () => ({
  dizinListele: dizinListeleMock,
  dosyaOku: dosyaOkuMock,
}));

import { hesaplariGetir } from "./hesaplariGetir";

describe("hesaplariGetir", () => {
  beforeEach(() => {
    dizinListeleMock.mockReset();
    dosyaOkuMock.mockReset();
  });

  it("kullanici adi alanindan gercek hesap adini cikarir", async () => {
    dizinListeleMock.mockResolvedValue(["profiller/sahsi-instagram.md"]);
    dosyaOkuMock.mockResolvedValue(
      "# Profil\n\n## Kimlik\n\n- **Kullanıcı adı:** @egenisankoc (instagram.com/egenisankoc)\n"
    );

    const hesaplar = await hesaplariGetir();

    expect(hesaplar).toEqual([
      {
        id: "sahsi-instagram",
        ad: "@egenisankoc (instagram.com/egenisankoc)",
        profilDosyasi: "profiller/sahsi-instagram.md",
      },
    ]);
  });

  it("kullanici adi yoksa isletme adini kullanir", async () => {
    dizinListeleMock.mockResolvedValue(["profiller/lezzetduragi-restoran.md"]);
    dosyaOkuMock.mockResolvedValue(
      "## İşletme\n\n- **İşletme adı:** Lezzet Durağı\n- **Konum (şehir/semt):** _(doldurulacak)_\n"
    );

    const hesaplar = await hesaplariGetir();

    expect(hesaplar[0].ad).toBe("Lezzet Durağı");
  });

  it("tum alanlar placeholder ise dosya adindan baslik turetir", async () => {
    dizinListeleMock.mockResolvedValue(["profiller/restoran-instagram.md"]);
    dosyaOkuMock.mockResolvedValue(
      "## İşletme\n\n- **İşletme adı:** _(doldurulacak)_\n- **Kullanıcı adı (Instagram):** _(doldurulacak)_\n"
    );

    const hesaplar = await hesaplariGetir();

    expect(hesaplar[0].ad).toBe("Restoran Instagram (profil eksik)");
  });

  it("dizin bossa bos dizi doner", async () => {
    dizinListeleMock.mockResolvedValue([]);

    const hesaplar = await hesaplariGetir();

    expect(hesaplar).toEqual([]);
  });

  it("tekil dosya okuma hatasinda o dosyayi atlar, digerlerini doner", async () => {
    dizinListeleMock.mockResolvedValue(["profiller/bozuk.md", "profiller/sahsi-instagram.md"]);
    dosyaOkuMock.mockImplementation(async (yol: string) => {
      if (yol === "profiller/bozuk.md") throw new Error("ag hatasi");
      return "- **Kullanıcı adı:** @egenisankoc\n";
    });

    const hesaplar = await hesaplariGetir();

    expect(hesaplar).toHaveLength(1);
    expect(hesaplar[0].id).toBe("sahsi-instagram");
  });
});
