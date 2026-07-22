import { describe, it, expect, vi, beforeEach } from "vitest";

const { dosyaOkuMock, hesaplariGetirMock } = vi.hoisted(() => ({
  dosyaOkuMock: vi.fn(),
  hesaplariGetirMock: vi.fn(),
}));

vi.mock("./github", () => ({ dosyaOku: dosyaOkuMock }));
vi.mock("./hesaplariGetir", () => ({ hesaplariGetir: hesaplariGetirMock }));

import { sistemTalimatiOlustur } from "./sistemTalimati";

describe("sistemTalimati", () => {
  beforeEach(() => {
    dosyaOkuMock.mockReset();
    hesaplariGetirMock.mockReset();
    hesaplariGetirMock.mockResolvedValue([
      { id: "restoran", ad: "Restoran Instagram", profilDosyasi: "profiller/restoran-instagram.md" },
    ]);
  });

  it("tum parcalari birlestirir", async () => {
    dosyaOkuMock.mockImplementation(async (yol: string) => {
      if (yol === "CLAUDE.md") return "KOK TALIMAT";
      if (yol === ".claude/agents/instagram-uzmani.md") return "AJAN TALIMATI";
      if (yol === ".claude/commands/analiz.md") return "KOMUT TALIMATI";
      if (yol === "profiller/restoran-instagram.md") return "PROFIL ICERIGI";
      return null;
    });

    const talimat = await sistemTalimatiOlustur("analiz", "restoran");

    expect(talimat).toContain("KOK TALIMAT");
    expect(talimat).toContain("AJAN TALIMATI");
    expect(talimat).toContain("KOMUT TALIMATI");
    expect(talimat).toContain("PROFIL ICERIGI");
    expect(talimat).toContain("Aktif Hesap Profili (Restoran Instagram)");
  });

  it("hesap verilmezse profil eklemez ve hesap listesini cekmez", async () => {
    dosyaOkuMock.mockImplementation(async (yol: string) => {
      if (yol === "CLAUDE.md") return "KOK TALIMAT";
      if (yol === ".claude/commands/trend.md") return "TREND KOMUTU";
      return null;
    });

    const talimat = await sistemTalimatiOlustur("trend", null);

    expect(talimat).not.toContain("Aktif Hesap Profili");
    expect(talimat).toContain("TREND KOMUTU");
    expect(hesaplariGetirMock).not.toHaveBeenCalled();
  });

  it("bulunamayan dosyalari sessizce atlar", async () => {
    dosyaOkuMock.mockResolvedValue(null);

    const talimat = await sistemTalimatiOlustur("analiz", "restoran");

    expect(talimat).toContain("read_file ve write_file araçlarını");
  });

  it("bilinmeyen hesap id'si icin profil eklemez", async () => {
    dosyaOkuMock.mockImplementation(async (yol: string) => {
      if (yol === "CLAUDE.md") return "KOK TALIMAT";
      return null;
    });

    const talimat = await sistemTalimatiOlustur("analiz", "yok-boyle-hesap");

    expect(talimat).not.toContain("Aktif Hesap Profili");
  });
});
