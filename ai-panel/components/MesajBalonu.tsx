import type { SohbetMesaji } from "../lib/types";

export default function MesajBalonu({ mesaj }: { mesaj: SohbetMesaji }) {
  return (
    <div className={`mesaj-balonu ${mesaj.rol === "user" ? "kullanici" : "asistan"}`}>
      {mesaj.icerik}
    </div>
  );
}
