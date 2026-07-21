import { describe, it, expect, vi, beforeEach } from "vitest";

const { createMock } = vi.hoisted(() => ({ createMock: vi.fn() }));

vi.mock("@anthropic-ai/sdk", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      messages: { create: createMock },
    })),
  };
});

const { dosyaOkuMock, dosyaYazMock } = vi.hoisted(() => ({
  dosyaOkuMock: vi.fn(),
  dosyaYazMock: vi.fn(),
}));
vi.mock("./github", () => ({
  dosyaOku: dosyaOkuMock,
  dosyaYaz: dosyaYazMock,
}));

import { sohbetIstegiGonder } from "./claude";

describe("claude", () => {
  beforeEach(() => {
    createMock.mockReset();
    dosyaOkuMock.mockReset();
    dosyaYazMock.mockReset();
    process.env.CLAUDE_MODEL = "claude-haiku-4-5";
  });

  it("arac kullanmadan direkt cevap doner", async () => {
    createMock.mockResolvedValue({
      stop_reason: "end_turn",
      content: [{ type: "text", text: "Merhaba, nasil yardimci olabilirim?" }],
      usage: { input_tokens: 500, output_tokens: 50 },
    });

    const sonuc = await sohbetIstegiGonder({
      sistemTalimati: "Sen bir asistansin.",
      mesajlar: [{ rol: "user", icerik: "selam" }],
    });

    expect(sonuc.cevap).toBe("Merhaba, nasil yardimci olabilirim?");
    expect(sonuc.girdiTokenSayisi).toBe(500);
    expect(sonuc.ciktiTokenSayisi).toBe(50);
    expect(sonuc.tahminiMaliyetUsd).toBeCloseTo(
      (500 / 1_000_000) * 1.0 + (50 / 1_000_000) * 5.0,
      8
    );
    expect(createMock).toHaveBeenCalledTimes(1);
  });

  it("read_file aracini calistirip sonucu tekrar api'ye gonderir", async () => {
    dosyaOkuMock.mockResolvedValue("PROFIL ICERIGI");
    createMock
      .mockResolvedValueOnce({
        stop_reason: "tool_use",
        content: [
          {
            type: "tool_use",
            id: "toolu_1",
            name: "read_file",
            input: { path: "profiller/restoran-instagram.md" },
          },
        ],
        usage: { input_tokens: 300, output_tokens: 40 },
      })
      .mockResolvedValueOnce({
        stop_reason: "end_turn",
        content: [{ type: "text", text: "Profili okudum, iste analiz." }],
        usage: { input_tokens: 400, output_tokens: 100 },
      });

    const sonuc = await sohbetIstegiGonder({
      sistemTalimati: "Sen bir asistansin.",
      mesajlar: [{ rol: "user", icerik: "restoran hesabini analiz et" }],
    });

    expect(dosyaOkuMock).toHaveBeenCalledWith("profiller/restoran-instagram.md");
    expect(sonuc.cevap).toBe("Profili okudum, iste analiz.");
    expect(sonuc.girdiTokenSayisi).toBe(700);
    expect(sonuc.ciktiTokenSayisi).toBe(140);
    expect(createMock).toHaveBeenCalledTimes(2);
  });

  it("write_file aracini calistirip dosyayi kaydeder", async () => {
    dosyaYazMock.mockResolvedValue(undefined);
    createMock
      .mockResolvedValueOnce({
        stop_reason: "tool_use",
        content: [
          {
            type: "tool_use",
            id: "toolu_2",
            name: "write_file",
            input: {
              path: "planlar/2026-07-19-restoran-haftalik-plan.md",
              content: "# Plan",
              commit_message: "haftalik plan eklendi",
            },
          },
        ],
        usage: { input_tokens: 300, output_tokens: 40 },
      })
      .mockResolvedValueOnce({
        stop_reason: "end_turn",
        content: [{ type: "text", text: "Plani kaydettim." }],
        usage: { input_tokens: 350, output_tokens: 30 },
      });

    const sonuc = await sohbetIstegiGonder({
      sistemTalimati: "Sen bir asistansin.",
      mesajlar: [{ rol: "user", icerik: "haftalik plan yaz" }],
    });

    expect(dosyaYazMock).toHaveBeenCalledWith(
      "planlar/2026-07-19-restoran-haftalik-plan.md",
      "# Plan",
      "haftalik plan eklendi"
    );
    expect(sonuc.cevap).toBe("Plani kaydettim.");
  });

  it("maksimum dongu sinirina ulasinca durur", async () => {
    createMock.mockResolvedValue({
      stop_reason: "tool_use",
      content: [{ type: "tool_use", id: "toolu_x", name: "read_file", input: { path: "yok.md" } }],
      usage: { input_tokens: 100, output_tokens: 10 },
    });
    dosyaOkuMock.mockResolvedValue(null);

    const sonuc = await sohbetIstegiGonder({
      sistemTalimati: "Sen bir asistansin.",
      mesajlar: [{ rol: "user", icerik: "sonsuz donguyu tetikle" }],
    });

    expect(createMock).toHaveBeenCalledTimes(8);
    expect(sonuc.girdiTokenSayisi).toBe(800);
  });

  it("gorsel iceren mesaji cok blokla api'ye gonderir", async () => {
    createMock.mockResolvedValue({
      stop_reason: "end_turn",
      content: [{ type: "text", text: "Ekran goruntusunu inceledim." }],
      usage: { input_tokens: 200, output_tokens: 30 },
    });

    const sonuc = await sohbetIstegiGonder({
      sistemTalimati: "Sen bir asistansin.",
      mesajlar: [
        {
          rol: "user",
          icerik: "bu ekran goruntusunu analiz et",
          gorseller: [{ mediaType: "image/jpeg", data: "aGVsbG8=" }],
        },
      ],
    });

    expect(sonuc.cevap).toBe("Ekran goruntusunu inceledim.");
    const gonderilenIstek = createMock.mock.calls[0][0];
    expect(gonderilenIstek.messages[0]).toEqual({
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: "aGVsbG8=" } },
        { type: "text", text: "bu ekran goruntusunu analiz et" },
      ],
    });
  });

  it("gorsel olmayan mesaji hala duz metin olarak gonderir", async () => {
    createMock.mockResolvedValue({
      stop_reason: "end_turn",
      content: [{ type: "text", text: "ok" }],
      usage: { input_tokens: 10, output_tokens: 5 },
    });

    await sohbetIstegiGonder({
      sistemTalimati: "Sen bir asistansin.",
      mesajlar: [{ rol: "user", icerik: "selam" }],
    });

    const gonderilenIstek = createMock.mock.calls[0][0];
    expect(gonderilenIstek.messages[0]).toEqual({ role: "user", content: "selam" });
  });
});
