// app/(dashboard)/students/page.tsx

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { StudentsTable } from "./_components/StudentsTable";

export default async function StudentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Ambil semua kelas milik guru ini
  const { data: classrooms } = await supabase
    .from("classrooms")
    .select("id, name")
    .eq("teacher_id", user!.id);

  const classroomIds = classrooms?.map((c) => c.id) || [];

  // Ambil semua siswa di kelas-kelas tersebut
  const { data: students } = await supabase
    .from("students")
    .select(`
      id,
      full_name,
      email,
      classroom_id,
      created_at,
      classrooms ( name )
    `)
    .in("classroom_id", classroomIds)
    .order("full_name");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage and view your students&apos; progress
          </p>
        </div>
        <Button asChild>
          <Link href="/students/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Link>
        </Button>
      </div>

      <StudentsTable students={students || []} />
    </div>
  );
}
