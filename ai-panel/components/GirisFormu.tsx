"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GirisFormu() {
  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const router = useRouter();

  async function girisYap(e: React.FormEvent) {
    e.preventDefault();
    setHata(null);
    setGonderiliyor(true);
    try {
      const yanit = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kullaniciAdi, sifre }),
      });
      if (!yanit.ok) {
        const govde = await yanit.json().catch(() => ({}));
        setHata(govde.hata || "Giriş başarısız.");
        return;
      }
      router.push("/");
      router.refresh();
    } finally {
      setGonderiliyor(false);
    }
  }

  return (
    <form onSubmit={girisYap} className="giris-formu">
      <h1>Sosyal Medya AI Paneli</h1>
      <label>
        Kullanıcı adı
        <input
          type="text"
          value={kullaniciAdi}
          onChange={(e) => setKullaniciAdi(e.target.value)}
          autoComplete="username"
          required
        />
      </label>
      <label>
        Şifre
        <input
          type="password"
          value={sifre}
          onChange={(e) => setSifre(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>
      {hata && <p className="hata-mesaji">{hata}</p>}
      <button type="submit" disabled={gonderiliyor}>
        {gonderiliyor ? "Giriş yapılıyor..." : "Giriş yap"}
      </button>
    </form>
  );
}
