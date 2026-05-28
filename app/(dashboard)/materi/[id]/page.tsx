import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Pencil } from "lucide-react";
import Link from "next/link";
import type { TeacherModule, TeacherModuleLesson } from "@/types";

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Pemula",
  intermediate: "Menengah",
  advanced: "Lanjut",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ModuleDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: row } = await supabase
    .from("teacher_modules")
    .select("*")
    .eq("id", id)
    .single();

  if (!row) notFound();

  const mod: TeacherModule = {
    ...row,
    lessons: (Array.isArray(row.lessons) ? row.lessons : []) as unknown as TeacherModuleLesson[],
  };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isOwner = profile?.role === "teacher" && row.teacher_id === user.id;

  if (!mod.is_published && !isOwner) notFound();

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <Link
          href="/materi"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali ke Materi
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">
                {DIFFICULTY_LABELS[mod.difficulty] ?? mod.difficulty}
              </Badge>
              {mod.target_grade && (
                <Badge variant="outline">
                  Kelas {mod.target_grade}
                </Badge>
              )}
              {isOwner && (
                <Badge variant={mod.is_published ? "default" : "outline"}>
                  {mod.is_published ? "Diterbitkan" : "Draft"}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{mod.title}</h1>
            {mod.description && (
              <p className="text-muted-foreground">{mod.description}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {mod.lessons.length} pelajaran
            </p>
          </div>
          {isOwner && (
            <Button asChild variant="outline" size="sm" className="shrink-0">
              <Link href={`/materi/${mod.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {mod.lessons.map((lesson, index) => (
          <div key={lesson.id} className="rounded-lg border p-5 space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
                {index + 1}
              </span>
              <h3 className="font-semibold">{lesson.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {lesson.content}
            </p>
            {lesson.braille && (
              <div className="rounded-md bg-muted px-4 py-3">
                <p className="text-xs text-muted-foreground mb-1">Karakter Braille</p>
                <p className="text-2xl tracking-widest">{lesson.braille}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
