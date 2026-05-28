import { createClient } from "@/lib/supabase/server";
import GradePicker from "../_components/GradePicker";

interface Props {
  searchParams: Promise<{ classId?: string }>;
}

export default async function KelasPage({ searchParams }: Props) {
  const { classId } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let className: string | null = null;
  if (classId) {
    const { data: cls } = await supabase
      .from("classrooms").select("name").eq("id", classId).eq("teacher_id", user!.id).single();
    className = cls?.name ?? null;
  }

  return <GradePicker classId={classId} className={className ?? undefined} />;
}
