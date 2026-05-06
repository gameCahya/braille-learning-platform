import { getBrailleReference } from "@/lib/braille";
import BrailleCharCard from "@/components/braille/BrailleCharCard";

export default function BrailleReferencePage() {
  const reference = getBrailleReference();

  const indicators = [
    {
      label: "Indikator Huruf Kapital",
      desc: "Ditempatkan sebelum huruf besar",
      symbol: "⠠",
      speakText: "capital letter indicator",
    },
    {
      label: "Indikator Angka",
      desc: "Ditempatkan sebelum angka",
      symbol: "⠼",
      speakText: "number indicator",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Panduan Braille
        </h1>
        <p className="text-muted-foreground mt-1">
          Referensi lengkap Braille Bahasa Inggris Grade 1. Klik tombol untuk
          memutar audio.
        </p>
      </div>

      {/* Struktur sel Braille */}
      <div className="bg-card border rounded-2xl p-6 space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          Struktur Sel Braille
        </h2>
        <p className="text-sm text-muted-foreground">
          Setiap karakter Braille terdiri dari 6 titik dalam 2 kolom × 3 baris.
          Titik diberi nomor 1–6:
        </p>
        <pre className="text-sm font-mono bg-muted rounded-xl px-5 py-4 text-foreground w-fit">
          {`1 • • 4\n2 • • 5\n3 • • 6`}
        </pre>
      </div>

      {/* Alfabet A–Z */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Alfabet (A–Z)
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            26 huruf dasar dalam Braille
          </p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {reference.alphabet.map((item) => (
            <BrailleCharCard
              key={item.char}
              char={item.char}
              braille={item.braille}
              dots={item.dots}
              speakText={item.char}
            />
          ))}
        </div>
      </section>

      {/* Angka 0–9 */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Angka (0–9)
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Angka dalam Braille didahului tanda indikator angka (⠼)
          </p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3">
          {reference.numbers.map((item) => (
            <BrailleCharCard
              key={item.char}
              char={item.char}
              braille={item.braille}
              speakText={item.char}
            />
          ))}
        </div>
      </section>

      {/* Tanda Baca */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Tanda Baca
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tanda baca umum dalam Braille
          </p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {reference.punctuation.map((item) => (
            <BrailleCharCard
              key={item.char}
              char={item.char}
              braille={item.braille}
            />
          ))}
        </div>
      </section>

      {/* Indikator Khusus */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Indikator Khusus
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Prefiks yang mengubah arti karakter berikutnya
          </p>
        </div>
        <div className="bg-card border rounded-2xl divide-y divide-border">
          {indicators.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.desc}
                </p>
              </div>
              <div className="text-4xl font-mono text-foreground">
                {item.symbol}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
