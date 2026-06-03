import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ChevronLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getQuizById } from "@/lib/data/quiz";
import { QuizPresenter } from "./_components/QuizPresenter";
import type { Quiz } from "@/lib/data/quiz";
import type { TeacherQuizQuestion } from "@/types";
import type { Tables } from "@/types/supabase";

export default async function QuizDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Coba cari di quiz statis dulu
  let quiz: Quiz | undefined = getQuizById(id);

  if (!quiz) {
    // Coba cari di teacher_quizzes
    const supabase = await createClient();
    const { data: row } = await supabase
      .from("teacher_quizzes")
      .select("*")
      .eq("id", id)
      .single();

    if (!row) notFound();

    const quizRow = row as Tables<"teacher_quizzes">;
    const questions =
      (quizRow.questions as unknown as TeacherQuizQuestion[]) ?? [];

    // Konversi ke format Quiz agar kompatibel dengan QuizPresenter
    quiz = {
      id: quizRow.id,
      title: quizRow.title,
      description: quizRow.description ?? "",
      topic: quizRow.topic,
      questions: questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        answer: q.answer,
      })),
    };
  }

  // Cek apakah user adalah pemilik quiz (untuk tombol edit)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let isOwner = false;

  if (user) {
    const { data: ownerRow } = await supabase
      .from("teacher_quizzes")
      .select("teacher_id")
      .eq("id", id)
      .single();

    isOwner = ownerRow?.teacher_id === user.id;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back + Edit */}
      <div className="flex items-center justify-between">
        <Link
          href="/quiz"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Kembali ke daftar quiz
        </Link>

        {isOwner && (
          <Button asChild variant="outline" size="sm">
            <Link href={`/quiz/${id}/edit`}>
              <Pencil className="h-4 w-4 mr-2" aria-hidden="true" />
              Edit Quiz
            </Link>
          </Button>
        )}
      </div>

      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
          {quiz.topic}
        </p>
        <h1 className="text-2xl font-bold text-foreground">{quiz.title}</h1>
        <p className="text-muted-foreground mt-1">{quiz.description}</p>
      </div>

      {/* Presenter */}
      <QuizPresenter quiz={quiz} />
    </div>
  );
}
