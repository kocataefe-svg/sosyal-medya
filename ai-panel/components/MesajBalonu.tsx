import type { SohbetMesaji } from "../lib/types";

export default function MesajBalonu({ mesaj }: { mesaj: SohbetMesaji }) {
  return (
    <div className={`mesaj-balonu ${mesaj.rol === "user" ? "kullanici" : "asistan"}`}>
      {mesaj.gorseller && mesaj.gorseller.length > 0 && (
        <div className="mesaj-gorselleri">
          {mesaj.gorseller.map((gorsel, i) => (
            <img
              key={i}
              src={`data:${gorsel.mediaType};base64,${gorsel.data}`}
              alt="Gönderilen görsel"
            />
          ))}
        </div>
      )}
      {mesaj.icerik && <div>{mesaj.icerik}</div>}
    </div>
  );
}
