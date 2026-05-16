import { createClient } from "@/lib/supabase/server";
import { MODULES } from "@/lib/data/modules";
import { getModuleUUID } from "@/lib/data/moduleMapping";
import ClassPicker from "./_components/ClassPicker";

export default async function LearnPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: classrooms } = await supabase
    .from("classrooms")
    .select("id, name, description")
    .eq("teacher_id", user!.id)
    .order("created_at", { ascending: false });

  const allModuleUUIDs = MODULES.map((m) => getModuleUUID(m.id));
  const totalModules = MODULES.length;

  const { data: progressData } = await supabase
    .from("class_progress")
    .select("classroom_id, module_id, status")
    .in("classroom_id", classrooms?.map((c) => c.id) ?? []);

  const classroomsWithProgress = (classrooms ?? []).map((cls) => {
    const completedCount = (progressData ?? []).filter(
      (p) => p.classroom_id === cls.id && p.status === "completed"
    ).length;
    return { ...cls, completedCount, totalModules };
  });

  // suppress unused warning
  void allModuleUUIDs;

  return <ClassPicker classrooms={classroomsWithProgress} />;
}
