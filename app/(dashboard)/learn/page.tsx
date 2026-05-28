import { createClient } from "@/lib/supabase/server";
import { ALL_MODULES } from "@/lib/data/modules";
import ClassPicker from "./_components/ClassPicker";

export default async function LearnPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const totalModules = ALL_MODULES.length;

  // Satu query dengan nested select — eliminasi waterfall classrooms → class_progress
  const { data: classrooms } = await supabase
    .from("classrooms")
    .select("id, name, description, class_progress(status)")
    .eq("teacher_id", user!.id)
    .order("created_at", { ascending: false });

  const classroomsWithProgress = (classrooms ?? []).map((cls) => {
    const progress = (cls.class_progress ?? []) as { status: string }[];
    const completedCount = progress.filter((p) => p.status === "completed").length;
    return {
      id: cls.id,
      name: cls.name,
      description: cls.description,
      completedCount,
      totalModules,
    };
  });

  return <ClassPicker classrooms={classroomsWithProgress} />;
}
