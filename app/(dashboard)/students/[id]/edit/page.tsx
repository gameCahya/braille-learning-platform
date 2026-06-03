import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { StudentForm } from "../../_components/StudentForm";

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "teacher") redirect("/students");

  // Fetch student
  const { data: student } = await supabase
    .from("students")
    .select("id, full_name, email, classroom_id, notes")
    .eq("id", id)
    .eq("teacher_id", user.id)
    .single();
  if (!student) notFound();

  // Fetch kelas
  const { data: classrooms } = await supabase
    .from("classrooms")
    .select("id, name")
    .eq("teacher_id", user.id)
    .order("name");

  return (
    <div className="max-w-2xl space-y-6">
      <Link
        href="/students"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Kembali ke Siswa
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Siswa</h1>
        <p className="text-muted-foreground mt-1">
          Perbarui informasi siswa {student.full_name}.
        </p>
      </div>

      <StudentForm
        student={{
          id: student.id,
          full_name: student.full_name,
          email: student.email,
          classroom_id: student.classroom_id,
          notes: student.notes,
        }}
        classrooms={classrooms || []}
      />
    </div>
  );
}
