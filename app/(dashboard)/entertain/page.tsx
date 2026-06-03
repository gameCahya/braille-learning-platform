import { Music } from "lucide-react";

export default function EntertainPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center py-24">
      <div className="p-4 rounded-2xl bg-muted">
        <Music className="h-12 w-12 text-muted-foreground/60" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">Entertain</h1>
      <p className="text-muted-foreground max-w-sm">
        Konten Entertain segera hadir. Akan ada lagu dan percakapan bahasa Inggris sederhana yang menyenangkan.
      </p>
    </div>
  );
}
