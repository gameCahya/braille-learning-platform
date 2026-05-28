import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { ModuleForm } from "../../_components/ModuleForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { TeacherModule, TeacherModuleLesson } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditModulePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "teacher") redirect("/materi");

  const { data: row } = await supabase
    .from("teacher_modules")
    .select("*")
    .eq("id", id)
    .eq("teacher_id", user.id)
    .single();

  if (!row) notFound();

  const mod: TeacherModule = {
    ...row,
    lessons: (Array.isArray(row.lessons) ? row.lessons : []) as unknown as TeacherModuleLesson[],
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href={`/materi/${id}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali ke Modul
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Modul</h1>
        <p className="text-muted-foreground">Perbarui konten modul pembelajaran</p>
      </div>

      <ModuleForm module={mod} />
    </div>
  );
}
