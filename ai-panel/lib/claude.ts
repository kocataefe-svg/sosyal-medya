import Anthropic from "@anthropic-ai/sdk";
import { dosyaOku, dosyaYaz } from "./github";
import type { SohbetMesaji } from "./types";

export type { SohbetMesaji };

export interface SohbetSonucu {
  cevap: string;
  girdiTokenSayisi: number;
  ciktiTokenSayisi: number;
  tahminiMaliyetUsd: number;
}

const GIRDI_FIYATI_MILYON_BASINA = 1.0;
const CIKTI_FIYATI_MILYON_BASINA = 5.0;
const MAKSIMUM_DONGU = 8;

const ozelAraclar = [
  {
    name: "read_file",
    description:
      "Depodaki bir dosyanın içeriğini okur. Yol depo köküne göre verilir, örn. 'profiller/restoran-instagram.md'.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "Depo köküne göre dosya yolu" },
      },
      required: ["path"],
    },
  },
  {
    name: "write_file",
    description:
      "Depoda yeni bir dosya oluşturur ya da var olanı günceller ve commit eder. Sadece planlar/, raporlar/, icerikler/, profiller/ altına yaz.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "Depo köküne göre dosya yolu" },
        content: { type: "string", description: "Dosyanın tam içeriği (markdown)" },
        commit_message: { type: "string", description: "Kısa commit mesajı" },
      },
      required: ["path", "content", "commit_message"],
    },
  },
];

function maliyetHesapla(girdiToken: number, ciktiToken: number): number {
  return (
    (girdiToken / 1_000_000) * GIRDI_FIYATI_MILYON_BASINA +
    (ciktiToken / 1_000_000) * CIKTI_FIYATI_MILYON_BASINA
  );
}

export async function sohbetIstegiGonder(params: {
  sistemTalimati: string;
  mesajlar: SohbetMesaji[];
}): Promise<SohbetSonucu> {
  const modelAdi = process.env.CLAUDE_MODEL || "claude-haiku-4-5";
  const client = new Anthropic();
  const mesajGecmisi: Anthropic.MessageParam[] = params.mesajlar.map((m) => {
    if (!m.gorseller || m.gorseller.length === 0) {
      return { role: m.rol, content: m.icerik };
    }
    const gorselBloklari: Anthropic.ImageBlockParam[] = m.gorseller.map((g) => ({
      type: "image",
      source: { type: "base64", media_type: g.mediaType, data: g.data },
    }));
    // Boş metin bloğu Anthropic API'ye gönderilemez (400 döner) — sadece
    // görselle, metinsiz gönderimde (arayüzde desteklenen bir yol) metin
    // bloğu hiç eklenmemeli.
    const bloklar: Array<Anthropic.ImageBlockParam | Anthropic.TextBlockParam> = [...gorselBloklari];
    if (m.icerik) {
      bloklar.push({ type: "text", text: m.icerik });
    }
    return { role: m.rol, content: bloklar };
  });

  let toplamGirdiToken = 0;
  let toplamCiktiToken = 0;
  let sonCevapMetni = "";

  for (let dongu = 0; dongu < MAKSIMUM_DONGU; dongu++) {
    const yanit = await client.messages.create({
      model: modelAdi,
      max_tokens: 4096,
      system: params.sistemTalimati,
      tools: [
        ...ozelAraclar,
        // Installed @anthropic-ai/sdk (0.32.x) predates typed server-tool
        // variants — its Tool interface has no `type` field at all. The API
        // accepts this shape at the wire level regardless; only the old
        // SDK's TS types don't model it yet.
        {
          type: "web_search_20260209",
          name: "web_search",
          allowed_callers: ["direct"],
        } as unknown as Anthropic.Tool,
      ],
      messages: mesajGecmisi,
    });

    toplamGirdiToken += yanit.usage.input_tokens;
    toplamCiktiToken += yanit.usage.output_tokens;

    const metinParcalari: string[] = [];
    for (const blok of yanit.content) {
      if (blok.type === "text") {
        metinParcalari.push(blok.text);
      }
    }
    sonCevapMetni = metinParcalari.join("\n");

    if (yanit.stop_reason !== "tool_use") {
      break;
    }

    mesajGecmisi.push({ role: "assistant", content: yanit.content });

    const dongudekiSonuclar: Anthropic.ToolResultBlockParam[] = [];
    for (const blok of yanit.content) {
      if (blok.type !== "tool_use") continue;
      if (blok.name === "read_file") {
        const yol = (blok.input as { path: string }).path;
        const icerik = await dosyaOku(yol);
        dongudekiSonuclar.push({
          type: "tool_result",
          tool_use_id: blok.id,
          content: icerik ?? `Dosya bulunamadı: ${yol}`,
          is_error: icerik === null,
        });
      } else if (blok.name === "write_file") {
        const girdi = blok.input as { path: string; content: string; commit_message: string };
        try {
          await dosyaYaz(girdi.path, girdi.content, girdi.commit_message);
          dongudekiSonuclar.push({
            type: "tool_result",
            tool_use_id: blok.id,
            content: `Kaydedildi: ${girdi.path}`,
          });
        } catch (hata) {
          dongudekiSonuclar.push({
            type: "tool_result",
            tool_use_id: blok.id,
            content: `Yazma hatası: ${hata instanceof Error ? hata.message : String(hata)}`,
            is_error: true,
          });
        }
      }
    }

    if (dongudekiSonuclar.length > 0) {
      mesajGecmisi.push({ role: "user", content: dongudekiSonuclar });
    } else {
      break;
    }
  }

  return {
    cevap: sonCevapMetni,
    girdiTokenSayisi: toplamGirdiToken,
    ciktiTokenSayisi: toplamCiktiToken,
    tahminiMaliyetUsd: maliyetHesapla(toplamGirdiToken, toplamCiktiToken),
  };
}
