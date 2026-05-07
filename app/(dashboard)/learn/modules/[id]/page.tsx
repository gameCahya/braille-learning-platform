"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  ArrowLeft,
  Pencil,
  Headphones,
  BookOpen,
  Mic,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ClipboardList,
} from "lucide-react";
import { getModuleById } from "@/lib/data/modules";
import { getModuleUUID } from "@/lib/data/moduleMapping";
import QuizComponent from "@/components/learning/QuizComponent";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import PhaseMenulis from "./_components/PhaseMenulis";
import PhaseMendengarkan from "./_components/PhaseMendengarkan";
import PhaseMembaca from "./_components/PhaseMembaca";
import PhaseBerbicara from "./_components/PhaseBerbicara";

type Phase = "menulis" | "mendengarkan" | "membaca" | "berbicara";

const PASSING_GRADE = 70;

const PHASES: {
  id: Phase;
  label: string;
  icon: React.ElementType;
  desc: string;
  border: string;
  activeBg: string;
  iconColor: string;
}[] = [
  {
    id: "menulis",
    label: "Menulis",
    icon: Pencil,
    desc: "Siswa tulis pola Braille di kertas",
    border: "border-blue-200 dark:border-blue-800",
    activeBg:
      "bg-blue-100 border-blue-500 dark:bg-blue-900 dark:border-blue-400",
    iconColor: "text-blue-600",
  },
  {
    id: "mendengarkan",
    label: "Mendengarkan",
    icon: Headphones,
    desc: "Putar audio, siswa mendengarkan",
    border: "border-purple-200 dark:border-purple-800",
    activeBg:
      "bg-purple-100 border-purple-500 dark:bg-purple-900 dark:border-purple-400",
    iconColor: "text-purple-600",
  },
  {
    id: "membaca",
    label: "Membaca",
    icon: BookOpen,
    desc: "Kosakata dan gambar untuk dibaca",
    border: "border-green-200 dark:border-green-800",
    activeBg:
      "bg-green-100 border-green-500 dark:bg-green-900 dark:border-green-400",
    iconColor: "text-green-600",
  },
  {
    id: "berbicara",
    label: "Berbicara",
    icon: Mic,
    desc: "Siswa ucapkan kata, putar panduan audio",
    border: "border-orange-200 dark:border-orange-800",
    activeBg:
      "bg-orange-100 border-orange-500 dark:bg-orange-900 dark:border-orange-400",
    iconColor: "text-orange-600",
  },
];

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.id as string;
  const moduleUUID = getModuleUUID(moduleId);

  const [activePhase, setActivePhase] = useState<Phase | null>("menulis");
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizPassed, setQuizPassed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModuleCompleted, setIsModuleCompleted] = useState(false);

  const learningModule = getModuleById(moduleId);

  useEffect(() => {
    async function loadProgress() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && learningModule) {
        const { data, error } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("module_id", moduleUUID)
          .maybeSingle();

        if (!error && data) {
          setIsModuleCompleted(data.completed || false);
        }
      }
      setLoading(false);
    }
    loadProgress();
  }, [moduleId, moduleUUID, learningModule]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Memuat modul...</p>
      </div>
    );
  }

  if (!learningModule) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground">Modul tidak ditemukan.</p>
        <Button onClick={() => router.push("/learn/modules")}>
          Kembali ke Modul
        </Button>
      </div>
    );
  }

  const hasExercises = (learningModule.content.exercises?.length ?? 0) > 0;

  const handleRetryQuiz = () => {
    setQuizCompleted(false);
    setQuizScore(0);
    setQuizPassed(false);
  };

  const handleCompleteModule = async () => {
    if (hasExercises && !quizPassed) {
      toast.error("Quiz belum lulus", {
        description: `Perlu minimal ${PASSING_GRADE}% untuk menyelesaikan modul.`,
      });
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Silakan masuk terlebih dahulu");
      setSaving(false);
      return;
    }

    try {
      const { error } = await supabase.from("user_progress").upsert(
        {
          user_id: user.id,
          module_id: moduleUUID,
          completed: true,
          score: quizScore || 100,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,module_id", ignoreDuplicates: false }
      );

      if (error) throw error;

      toast.success("Modul selesai!", { description: "Kerja bagus!" });
      setIsModuleCompleted(true);
      setTimeout(() => router.push("/learn/modules"), 2000);
    } catch {
      toast.error("Gagal menyimpan progress");
    } finally {
      setSaving(false);
    }
  };

  const handleQuizComplete = async (
    score: number,
    answers: Record<string, string>
  ) => {
    setQuizScore(score);
    setQuizCompleted(true);
    const passed = score >= PASSING_GRADE;
    setQuizPassed(passed);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("quiz_results").insert({
        user_id: user.id,
        module_id: moduleUUID,
        score,
        total_points: 100,
        correct_answers: Object.values(answers).filter((a) => a === "correct")
          .length,
        total_questions: Object.keys(answers).length,
        answers,
      });
    }

    if (passed) {
      toast.success("Quiz lulus! 🎉", { description: `Skor: ${score}%` });
    } else {
      toast.error("Quiz belum lulus", {
        description: `Skor: ${score}%. Perlu minimal ${PASSING_GRADE}%.`,
      });
    }
  };

  const difficultyColor =
    learningModule.difficulty === "beginner"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : learningModule.difficulty === "intermediate"
      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push("/learn/modules")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Modul
        </Button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {learningModule.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              {learningModule.description}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge className={difficultyColor}>
              {learningModule.difficulty}
            </Badge>
            {isModuleCompleted && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Selesai
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Pilih Fase */}
      {!showQuiz && (
        <div>
          <h2 className="text-base font-semibold mb-3 text-muted-foreground uppercase tracking-wide text-xs">
            Pilih Fase Belajar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PHASES.map((phase) => {
              const Icon = phase.icon;
              const isActive = activePhase === phase.id;
              return (
                <button
                  key={phase.id}
                  onClick={() =>
                    setActivePhase(isActive ? null : phase.id)
                  }
                  className={`
                    rounded-xl border-2 p-4 text-left transition-all cursor-pointer
                    ${isActive ? phase.activeBg : `bg-card ${phase.border}`}
                    hover:opacity-90
                  `}
                >
                  <Icon className={`h-6 w-6 mb-2 ${phase.iconColor}`} />
                  <p className="font-semibold text-sm">{phase.label}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">
                    {phase.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Konten Fase */}
      {!showQuiz && activePhase === "menulis" && (
        <PhaseMenulis lessons={learningModule.content.lessons} />
      )}
      {!showQuiz && activePhase === "mendengarkan" && (
        <PhaseMendengarkan lessons={learningModule.content.lessons} />
      )}
      {!showQuiz && activePhase === "membaca" && (
        <PhaseMembaca lessons={learningModule.content.lessons} />
      )}
      {!showQuiz && activePhase === "berbicara" && (
        <PhaseBerbicara
          lessons={learningModule.content.lessons}
          moduleId={moduleId}
        />
      )}

      {/* Quiz */}
      {showQuiz && hasExercises && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowQuiz(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-bold">Quiz Modul</h2>
            <Badge variant="outline" className="ml-auto">
              Minimum {PASSING_GRADE}%
            </Badge>
          </div>

          {!quizCompleted ? (
            <QuizComponent
              exercises={learningModule.content.exercises!}
              onComplete={handleQuizComplete}
            />
          ) : (
            <div className="space-y-4">
              <Card
                className={
                  quizPassed ? "border-green-500" : "border-destructive"
                }
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {quizPassed ? (
                      <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" />
                    ) : (
                      <XCircle className="h-8 w-8 text-destructive shrink-0" />
                    )}
                    <div>
                      <CardTitle
                        className={
                          quizPassed ? "text-green-700" : "text-destructive"
                        }
                      >
                        {quizPassed ? "Quiz Lulus! 🎉" : "Quiz Belum Lulus"}
                      </CardTitle>
                      <CardDescription>
                        Skor: {quizScore}% — Minimum: {PASSING_GRADE}%
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <div className="flex gap-3">
                {!quizPassed && (
                  <Button
                    variant="outline"
                    onClick={handleRetryQuiz}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Coba Lagi
                  </Button>
                )}
                {quizPassed && (
                  <Button
                    onClick={handleCompleteModule}
                    disabled={saving}
                    className="flex-1"
                  >
                    {saving ? "Menyimpan..." : "Selesaikan Modul"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Aksi Bawah */}
      {!showQuiz && (
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex gap-3 flex-wrap">
              {hasExercises && (
                <Button
                  variant="outline"
                  onClick={() => setShowQuiz(true)}
                  className="flex-1"
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  {quizPassed ? `Quiz Selesai (${quizScore}%)` : "Ambil Quiz"}
                </Button>
              )}
              <Button
                onClick={handleCompleteModule}
                disabled={saving || isModuleCompleted || (hasExercises && !quizPassed)}
                className="flex-1"
              >
                {saving
                  ? "Menyimpan..."
                  : isModuleCompleted
                  ? "Modul Sudah Selesai ✓"
                  : "Selesaikan Modul"}
              </Button>
            </div>
            {hasExercises && !quizPassed && (
              <p className="text-xs text-muted-foreground text-center">
                Lulus quiz terlebih dahulu untuk menyelesaikan modul
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
