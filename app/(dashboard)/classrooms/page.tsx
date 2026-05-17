// app/(dashboard)/classrooms/page.tsx

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ClassroomsTable } from "./_components/ClassroomsTable";
import TutorialDriver from "@/components/tutorial/TutorialDriver";
import { classroomsSteps } from "@/lib/tutorial/steps";

export default async function ClassroomsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: classrooms } = await supabase
    .from("classrooms")
    .select("id, name, description, created_at")
    .eq("teacher_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div id="classrooms-header" className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelas</h1>
          <p className="text-muted-foreground">
            Kelola kelas dan kelompok siswa Anda
          </p>
        </div>
        <Button id="classrooms-add-btn" asChild>
          <Link href="/classrooms/new">
            <Plus className="mr-2 h-4 w-4" />
            Kelas Baru
          </Link>
        </Button>
      </div>

      <div id="classrooms-table">
        <ClassroomsTable classrooms={classrooms || []} />
      </div>

      <TutorialDriver steps={classroomsSteps} storageKey="bralingo-tutorial-classrooms" />
    </div>
  );
}
