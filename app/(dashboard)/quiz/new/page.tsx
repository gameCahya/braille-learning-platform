import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { QuizForm } from "../_components/QuizForm";

export default async function NewQuizPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "teacher") redirect("/quiz");

  return (
    <div className="max-w-2xl mx-auto">
      <QuizForm />
    </div>
  );
}
