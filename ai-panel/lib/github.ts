import { Octokit } from "@octokit/rest";

function octokitOlustur(): Octokit {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN ortam değişkeni tanımlı değil");
  return new Octokit({ auth: token });
}

function depoBilgisi() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "master";
  if (!owner || !repo) {
    throw new Error("GITHUB_OWNER/GITHUB_REPO ortam değişkenleri tanımlı değil");
  }
  return { owner, repo, branch };
}

export async function dosyaOku(yol: string): Promise<string | null> {
  const octokit = octokitOlustur();
  const { owner, repo, branch } = depoBilgisi();
  try {
    const yanit = await octokit.repos.getContent({ owner, repo, path: yol, ref: branch });
    const veri = yanit.data;
    if (Array.isArray(veri) || veri.type !== "file" || !veri.content) {
      return null;
    }
    return Buffer.from(veri.content, "base64").toString("utf8");
  } catch (hata: any) {
    if (hata.status === 404) return null;
    throw hata;
  }
}

export async function dosyaYaz(yol: string, icerik: string, commitMesaji: string): Promise<void> {
  const octokit = octokitOlustur();
  const { owner, repo, branch } = depoBilgisi();
  let mevcutSha: string | undefined;
  try {
    const yanit = await octokit.repos.getContent({ owner, repo, path: yol, ref: branch });
    const veri = yanit.data;
    if (!Array.isArray(veri) && veri.type === "file") {
      mevcutSha = veri.sha;
    }
  } catch (hata: any) {
    if (hata.status !== 404) throw hata;
  }
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: yol,
    message: commitMesaji,
    content: Buffer.from(icerik, "utf8").toString("base64"),
    branch,
    sha: mevcutSha,
  });
}

export async function dizinListele(yol: string): Promise<string[]> {
  const octokit = octokitOlustur();
  const { owner, repo, branch } = depoBilgisi();
  try {
    const yanit = await octokit.repos.getContent({ owner, repo, path: yol, ref: branch });
    const veri = yanit.data;
    if (!Array.isArray(veri)) return [];
    return veri
      .filter((oge: any) => oge.type === "file" && oge.name.endsWith(".md"))
      .map((oge: any) => oge.path as string);
  } catch (hata: any) {
    if (hata.status === 404) return [];
    throw hata;
  }
}
