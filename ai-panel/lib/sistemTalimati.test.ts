import { describe, it, expect, vi, beforeEach } from "vitest";

const { dosyaOkuMock } = vi.hoisted(() => ({
  dosyaOkuMock: vi.fn(),
}));

vi.mock("./github", () => ({ dosyaOku: dosyaOkuMock }));

import { sistemTalimatiOlustur } from "./sistemTalimati";

describe("sistemTalimati", () => {
  beforeEach(() => {
    dosyaOkuMock.mockReset();
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

  it("hesap verilmezse profil eklemez", async () => {
    dosyaOkuMock.mockImplementation(async (yol: string) => {
      if (yol === "CLAUDE.md") return "KOK TALIMAT";
      if (yol === ".claude/commands/trend.md") return "TREND KOMUTU";
      return null;
    });

    const talimat = await sistemTalimatiOlustur("trend", null);

    expect(talimat).not.toContain("Aktif Hesap Profili");
    expect(talimat).toContain("TREND KOMUTU");
  });

  it("bulunamayan dosyalari sessizce atlar", async () => {
    dosyaOkuMock.mockResolvedValue(null);

    const talimat = await sistemTalimatiOlustur("analiz", "restoran");

    expect(talimat).toContain("read_file ve write_file araçlarını");
  });
});
