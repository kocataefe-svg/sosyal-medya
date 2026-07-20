import { describe, it, expect, vi, beforeEach } from "vitest";

const { rpushMock, lrangeMock, connectMock, onMock } = vi.hoisted(() => ({
  rpushMock: vi.fn(),
  lrangeMock: vi.fn(),
  connectMock: vi.fn(),
  onMock: vi.fn(),
}));

vi.mock("redis", () => ({
  createClient: vi.fn(() => ({
    connect: connectMock,
    rPush: rpushMock,
    lRange: lrangeMock,
    on: onMock,
  })),
}));

import { kullanimKaydet, kullanimOzetiGetir } from "./kullanimKaydi";

describe("kullanimKaydi", () => {
  beforeEach(() => {
    process.env.REDIS_URL = "redis://localhost:6379";
    rpushMock.mockReset();
    lrangeMock.mockReset();
    connectMock.mockReset();
    connectMock.mockResolvedValue(undefined);
    onMock.mockReset();
  });

  it("kaydi kv listesine ekler", async () => {
    rpushMock.mockResolvedValue(1);
    await kullanimKaydet({
      kullaniciAdi: "ata",
      mod: "analiz",
      model: "claude-haiku-4-5",
      girdiToken: 1000,
      ciktiToken: 200,
      maliyetUsd: 0.002,
      zaman: "2026-07-19T10:00:00.000Z",
    });
    expect(rpushMock).toHaveBeenCalledWith(
      "ai-panel:kullanim-kayitlari",
      expect.stringContaining('"kullaniciAdi":"ata"')
    );
  });

  it("kullanicilara gore toplam maliyeti hesaplar", async () => {
    lrangeMock.mockResolvedValue([
      JSON.stringify({
        kullaniciAdi: "ata",
        mod: "analiz",
        model: "claude-haiku-4-5",
        girdiToken: 1000,
        ciktiToken: 200,
        maliyetUsd: 0.01,
        zaman: "2026-07-19T10:00:00.000Z",
      }),
      JSON.stringify({
        kullaniciAdi: "ata",
        mod: "icerik",
        model: "claude-haiku-4-5",
        girdiToken: 500,
        ciktiToken: 100,
        maliyetUsd: 0.005,
        zaman: "2026-07-19T11:00:00.000Z",
      }),
      JSON.stringify({
        kullaniciAdi: "arkadas",
        mod: "trend",
        model: "claude-haiku-4-5",
        girdiToken: 2000,
        ciktiToken: 300,
        maliyetUsd: 0.02,
        zaman: "2026-07-19T12:00:00.000Z",
      }),
    ]);

    const ozet = await kullanimOzetiGetir();

    expect(ozet).toHaveLength(2);
    expect(ozet[0].kullaniciAdi).toBe("arkadas");
    expect(ozet[0].istekSayisi).toBe(1);
    expect(ozet[0].toplamMaliyetUsd).toBeCloseTo(0.02, 6);
    expect(ozet[1].kullaniciAdi).toBe("ata");
    expect(ozet[1].istekSayisi).toBe(2);
    expect(ozet[1].toplamMaliyetUsd).toBeCloseTo(0.015, 6);
  });

  it("bos kayit listesinde bos dizi doner", async () => {
    lrangeMock.mockResolvedValue([]);
    const ozet = await kullanimOzetiGetir();
    expect(ozet).toEqual([]);
  });

  it("baglanti hatasindan sonra bir sonraki cagri tekrar baglanmayi dener", async () => {
    // Bu test, singleton'un taze bir kopyasini almak icin modulu izole ediyor
    // (ust seviyedeki import zaten cozulmus bir baglantiyla calisiyor).
    vi.resetModules();
    connectMock.mockReset();
    connectMock.mockRejectedValueOnce(new Error("baglanti koptu"));
    connectMock.mockResolvedValueOnce(undefined);
    rpushMock.mockReset();
    rpushMock.mockResolvedValue(1);

    const { kullanimKaydet: tazeKaydet } = await import("./kullanimKaydi");

    const kayit = {
      kullaniciAdi: "ata",
      mod: "analiz",
      model: "claude-haiku-4-5",
      girdiToken: 1,
      ciktiToken: 1,
      maliyetUsd: 0.0001,
      zaman: "2026-07-19T10:00:00.000Z",
    };

    await expect(tazeKaydet(kayit)).rejects.toThrow("baglanti koptu");
    await tazeKaydet(kayit);

    expect(connectMock).toHaveBeenCalledTimes(2);
    expect(rpushMock).toHaveBeenCalledTimes(1);
  });
});
