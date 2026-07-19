import { describe, it, expect, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import {
  oturumTokeniOlustur,
  oturumTokeniDogrula,
  kullaniciyiBul,
  sifreDogrula,
} from "./auth";

describe("auth", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = "test-sirri-1234";
    process.env.AI_PANEL_USERS = JSON.stringify([
      { kullaniciAdi: "ata", sifreHash: bcrypt.hashSync("gizli123", 10), sahipMi: true },
      { kullaniciAdi: "arkadas", sifreHash: bcrypt.hashSync("parola456", 10), sahipMi: false },
    ]);
  });

  it("gecerli kullaniciyi bulur", () => {
    const kullanici = kullaniciyiBul("ata");
    expect(kullanici?.kullaniciAdi).toBe("ata");
    expect(kullanici?.sahipMi).toBe(true);
  });

  it("olmayan kullaniciyi null doner", () => {
    expect(kullaniciyiBul("yok")).toBeNull();
  });

  it("dogru sifreyi onaylar", async () => {
    const kullanici = kullaniciyiBul("ata")!;
    expect(await sifreDogrula("gizli123", kullanici.sifreHash)).toBe(true);
  });

  it("yanlis sifreyi reddeder", async () => {
    const kullanici = kullaniciyiBul("ata")!;
    expect(await sifreDogrula("yanlis", kullanici.sifreHash)).toBe(false);
  });

  it("olusturulan token dogrulanabilir", async () => {
    const token = await oturumTokeniOlustur({ kullaniciAdi: "ata", sahipMi: true });
    const dogrulanan = await oturumTokeniDogrula(token);
    expect(dogrulanan).toEqual({ kullaniciAdi: "ata", sahipMi: true });
  });

  it("bozulmus tokeni reddeder", async () => {
    const token = await oturumTokeniOlustur({ kullaniciAdi: "ata", sahipMi: true });
    const bozuk = token.slice(0, -2) + "xx";
    expect(await oturumTokeniDogrula(bozuk)).toBeNull();
  });

  it("farkli sirla imzalanmis tokeni reddeder", async () => {
    const token = await oturumTokeniOlustur({ kullaniciAdi: "ata", sahipMi: true });
    process.env.SESSION_SECRET = "baska-sir";
    expect(await oturumTokeniDogrula(token)).toBeNull();
  });
});
