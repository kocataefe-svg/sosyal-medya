import { describe, it, expect, vi, beforeEach } from "vitest";

const getContentMock = vi.fn();
const createOrUpdateMock = vi.fn();

vi.mock("@octokit/rest", () => ({
  Octokit: vi.fn().mockImplementation(() => ({
    repos: {
      getContent: getContentMock,
      createOrUpdateFileContents: createOrUpdateMock,
    },
  })),
}));

import { dosyaOku, dosyaYaz, dizinListele } from "./github";

describe("github", () => {
  beforeEach(() => {
    process.env.GITHUB_TOKEN = "test-token";
    process.env.GITHUB_OWNER = "kocataefe-svg";
    process.env.GITHUB_REPO = "sosyal-medya";
    process.env.GITHUB_BRANCH = "master";
    getContentMock.mockReset();
    createOrUpdateMock.mockReset();
  });

  it("var olan dosyayi okur", async () => {
    getContentMock.mockResolvedValue({
      data: { type: "file", content: Buffer.from("merhaba").toString("base64"), sha: "abc123" },
    });
    const icerik = await dosyaOku("profiller/sahsi-instagram.md");
    expect(icerik).toBe("merhaba");
    expect(getContentMock).toHaveBeenCalledWith({
      owner: "kocataefe-svg",
      repo: "sosyal-medya",
      path: "profiller/sahsi-instagram.md",
      ref: "master",
    });
  });

  it("olmayan dosya icin null doner", async () => {
    getContentMock.mockRejectedValue({ status: 404 });
    const icerik = await dosyaOku("olmayan.md");
    expect(icerik).toBeNull();
  });

  it("yeni dosya olustururken sha gondermez", async () => {
    getContentMock.mockRejectedValue({ status: 404 });
    createOrUpdateMock.mockResolvedValue({});
    await dosyaYaz("planlar/yeni-plan.md", "icerik", "yeni plan eklendi");
    expect(createOrUpdateMock).toHaveBeenCalledWith(
      expect.objectContaining({ path: "planlar/yeni-plan.md", sha: undefined })
    );
  });

  it("var olan dosyayi guncellerken sha gonderir", async () => {
    getContentMock.mockResolvedValue({
      data: { type: "file", content: Buffer.from("eski").toString("base64"), sha: "eski-sha" },
    });
    createOrUpdateMock.mockResolvedValue({});
    await dosyaYaz("planlar/mevcut-plan.md", "yeni icerik", "plan guncellendi");
    expect(createOrUpdateMock).toHaveBeenCalledWith(
      expect.objectContaining({ path: "planlar/mevcut-plan.md", sha: "eski-sha" })
    );
  });

  it("dizindeki .md dosyalarinin yollarini listeler", async () => {
    getContentMock.mockResolvedValue({
      data: [
        { type: "file", name: "sahsi-instagram.md", path: "profiller/sahsi-instagram.md" },
        { type: "file", name: "restoran-instagram.md", path: "profiller/restoran-instagram.md" },
        { type: "file", name: "README.md.bak", path: "profiller/README.md.bak" },
        { type: "dir", name: "alt-klasor", path: "profiller/alt-klasor" },
      ],
    });

    const yollar = await dizinListele("profiller");

    expect(yollar).toEqual([
      "profiller/sahsi-instagram.md",
      "profiller/restoran-instagram.md",
    ]);
  });

  it("dizin yoksa bos dizi doner", async () => {
    getContentMock.mockRejectedValue({ status: 404 });

    const yollar = await dizinListele("profiller");

    expect(yollar).toEqual([]);
  });
});
