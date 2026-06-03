import { createClient } from "@/lib/supabase/server";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { StudentForm } from "../_components/StudentForm";

export default async function NewStudentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: classrooms } = await supabase
    .from("classrooms")
    .select("id, name")
    .eq("teacher_id", user!.id)
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
        <h1 className="text-3xl font-bold tracking-tight">Tambah Siswa Baru</h1>
        <p className="text-muted-foreground mt-1">
          Buat profil untuk siswa baru.
        </p>
      </div>

      <StudentForm classrooms={classrooms || []} />
    </div>
  );
}
