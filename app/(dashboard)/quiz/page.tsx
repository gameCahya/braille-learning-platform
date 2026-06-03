import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { quizzes, quizTopics } from "@/lib/data/quiz";
import {
  ClipboardList,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import TutorialDriver from "@/components/tutorial/TutorialDriver";
import { quizSteps } from "@/lib/tutorial/steps";
import { DeleteQuizButton } from "./_components/DeleteQuizButton";
import type { TeacherQuiz, TeacherQuizQuestion } from "@/types";
import type { Tables } from "@/types/supabase";

export default async function QuizPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Cek apakah user adalah guru
  let isTeacher = false;
  let teacherQuizzes: TeacherQuiz[] = [];

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    isTeacher = profile?.role === "teacher";

    if (isTeacher) {
      const { data: rows } = await supabase
        .from("teacher_quizzes")
        .select("*")
        .eq("teacher_id", user.id)
        .order("created_at", { ascending: false });

      teacherQuizzes = (rows ?? []).map((row) => {
        const r = row as Tables<"teacher_quizzes">;
        const questions =
          (r.questions as unknown as TeacherQuizQuestion[]) ?? [];
        return { ...r, questions };
      });
    }
  }

  // Gabungkan topik dari quiz statis dan quiz guru
  const teacherTopics = [...new Set(teacherQuizzes.map((q) => q.topic))];
  const allTopics = [...quizTopics];

  return (
    <div className="space-y-6">
      <div id="quiz-header" className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Quiz & Test
          </h1>
          <p className="text-muted-foreground mt-1">
            Pilih kuis untuk ditampilkan kepada siswa di kelas.
          </p>
        </div>
        {isTeacher && (
          <Button id="quiz-add-btn" asChild>
            <Link href="/quiz/new">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Buat Quiz
            </Link>
          </Button>
        )}
      </div>

      {/* ============ Quiz Guru ============ */}
      {isTeacher && teacherQuizzes.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Quiz Saya
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {teacherQuizzes.map((quiz) => (
              <div key={quiz.id} className="relative group">
                <Link href={`/quiz/${quiz.id}`}>
                  <Card className="hover:border-primary hover:shadow-sm transition-all cursor-pointer h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <ClipboardList
                          className="h-5 w-5 text-primary mt-0.5 shrink-0"
                          aria-hidden="true"
                        />
                        <div className="flex items-center gap-1">
                          {!quiz.is_published && (
                            <Badge variant="secondary" className="text-xs">
                              Draft
                            </Badge>
                          )}
                          <ChevronRight
                            className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                      <CardTitle className="text-base">{quiz.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {quiz.description || `${quiz.questions.length} soal — Topik: ${quiz.topic}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        {quiz.questions.length} soal
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                {/* Tombol Edit & Delete */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="Edit quiz"
                  >
                    <Link href={`/quiz/${quiz.id}/edit`}>
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </Button>
                  <DeleteQuizButton quizId={quiz.id} quizTitle={quiz.title} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============ Quiz Statis ============ */}
      <div id="quiz-topics" className="space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Quiz Standar
        </h2>
        {allTopics.map((topic) => (
          <div key={topic} className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/60">
              {topic}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {quizzes
                .filter((q) => q.topic === topic)
                .map((quiz) => (
                  <Link key={quiz.id} href={`/quiz/${quiz.id}`}>
                    <Card className="hover:border-primary hover:shadow-sm transition-all cursor-pointer h-full">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <ClipboardList
                            className="h-5 w-5 text-primary mt-0.5 shrink-0"
                            aria-hidden="true"
                          />
                          <ChevronRight
                            className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                        </div>
                        <CardTitle className="text-base">{quiz.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {quiz.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          {quiz.questions.length} soal
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>

      <TutorialDriver
        steps={quizSteps}
        storageKey="bralingo-tutorial-quiz"
      />
    </div>
  );
}
