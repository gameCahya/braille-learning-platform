import { BookOpen } from "lucide-react";

export default function MateriPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center py-24">
      <div className="p-4 rounded-2xl bg-muted">
        <BookOpen className="h-12 w-12 text-muted-foreground/60" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">Materi</h1>
      <p className="text-muted-foreground max-w-sm">
        Konten Materi segera hadir. Guru akan menyiapkan modul pembelajaran untuk kelasmu.
      </p>
    </div>
  );
}
