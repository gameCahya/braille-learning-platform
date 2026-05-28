import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ModulesTable } from "./_components/ModulesTable";
import { redirect } from "next/navigation";
import type { TeacherModule } from "@/types";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

export default async function MateriPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isTeacher = profile?.role === "teacher";

  if (isTeacher) {
    const { data: rows } = await supabase
      .from("teacher_modules")
      .select("*")
      .eq("teacher_id", user.id)
      .order("order_number", { ascending: true });

    const modules: TeacherModule[] = (rows ?? []).map((r) => ({
      ...r,
      lessons: Array.isArray(r.lessons) ? r.lessons : [],
    }));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Materi</h1>
            <p className="text-muted-foreground">
              Buat dan kelola modul pembelajaran untuk siswa Anda
            </p>
          </div>
          <Button asChild>
            <Link href="/materi/new">
              <Plus className="mr-2 h-4 w-4" />
              Modul Baru
            </Link>
          </Button>
        </div>

        <ModulesTable modules={modules} />
      </div>
    );
  }

  // Tampilan siswa — modul yang diterbitkan dari guru kelasnya
  const { data: rows } = await supabase
    .from("teacher_modules")
    .select("*")
    .eq("is_published", true)
    .order("order_number", { ascending: true });

  const modules: TeacherModule[] = (rows ?? []).map((r) => ({
    ...r,
    lessons: Array.isArray(r.lessons) ? r.lessons : [],
  }));

  if (modules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center py-24">
        <div className="p-4 rounded-2xl bg-muted">
          <BookOpen className="h-12 w-12 text-muted-foreground/60" />
        </div>
        <h1 className="text-2xl font-bold">Belum Ada Materi</h1>
        <p className="text-muted-foreground max-w-sm">
          Guru Anda belum menerbitkan modul. Cek lagi nanti.
        </p>
      </div>
    );
  }

  const DIFFICULTY_LABELS: Record<string, string> = {
    beginner: "Pemula",
    intermediate: "Menengah",
    advanced: "Lanjut",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Materi</h1>
        <p className="text-muted-foreground">Modul pembelajaran dari guru Anda</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => (
          <Link
            key={mod.id}
            href={`/materi/${mod.id}`}
            className="rounded-lg border p-5 space-y-3 hover:border-primary/50 hover:shadow-sm transition-all block"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-tight">{mod.title}</h3>
              <Badge variant="secondary" className="shrink-0 text-xs">
                {DIFFICULTY_LABELS[mod.difficulty] ?? mod.difficulty}
              </Badge>
            </div>
            {mod.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {mod.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {mod.lessons.length} pelajaran
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
