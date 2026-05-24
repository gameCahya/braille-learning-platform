import { createClient } from "@/lib/supabase/server";
import PracticeClient from "./_components/PracticeClient";

export default async function PracticePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let gradeLevel: string | null = null;
  let role: string = "teacher";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, grade_level")
      .eq("id", user.id)
      .single();
    gradeLevel = profile?.grade_level ?? null;
    role = profile?.role ?? "teacher";
  }

  return <PracticeClient gradeLevel={gradeLevel} role={role} />;
}
