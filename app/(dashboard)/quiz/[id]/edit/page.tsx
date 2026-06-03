import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { QuizForm } from "../../_components/QuizForm";
import type { TeacherQuiz, TeacherQuizQuestion } from "@/types";
import type { Tables } from "@/types/supabase";

export default async function EditQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  const { data: row } = await supabase
    .from("teacher_quizzes")
    .select("*")
    .eq("id", id)
    .eq("teacher_id", user.id)
    .single();

  if (!row) notFound();

  const quizRow = row as Tables<"teacher_quizzes">;
  const questions = (quizRow.questions as unknown as TeacherQuizQuestion[]) ?? [];

  const quiz: TeacherQuiz = {
    ...quizRow,
    questions,
  };

  return (
    <div className="max-w-2xl mx-auto">
      <QuizForm quiz={quiz} />
    </div>
  );
}
