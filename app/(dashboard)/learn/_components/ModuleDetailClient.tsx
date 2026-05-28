"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
  School,
  Play,
  CopyPlus,
} from "lucide-react";
import { getModuleById } from "@/lib/data/modules";
import { getModuleUUID } from "@/lib/data/moduleMapping";
import QuizComponent from "@/components/learning/QuizComponent";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import PhaseMenulis from "./PhaseMenulis";
import PhaseMendengarkan from "./PhaseMendengarkan";
import PhaseMembaca from "./PhaseMembaca";
import PhaseBerbicara from "./PhaseBerbicara";
import TutorialDriver from "@/components/tutorial/TutorialDriver";
import { moduleDetailSteps } from "@/lib/tutorial/steps";
import { duplicateModule } from "../_actions/duplicate-module";

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
    activeBg: "bg-blue-100 border-blue-500 dark:bg-blue-900 dark:border-blue-400",
    iconColor: "text-blue-600",
  },
  {
    id: "mendengarkan",
    label: "Mendengarkan",
    icon: Headphones,
    desc: "Putar audio, siswa mendengarkan",
    border: "border-purple-200 dark:border-purple-800",
    activeBg: "bg-purple-100 border-purple-500 dark:bg-purple-900 dark:border-purple-400",
    iconColor: "text-purple-600",
  },
  {
    id: "membaca",
    label: "Membaca",
    icon: BookOpen,
    desc: "Kosakata dan gambar untuk dibaca",
    border: "border-green-200 dark:border-green-800",
    activeBg: "bg-green-100 border-green-500 dark:bg-green-900 dark:border-green-400",
    iconColor: "text-green-600",
  },
  {
    id: "berbicara",
    label: "Berbicara",
    icon: Mic,
    desc: "Siswa ucapkan kata, putar panduan audio",
    border: "border-orange-200 dark:border-orange-800",
    activeBg: "bg-orange-100 border-orange-500 dark:bg-orange-900 dark:border-orange-400",
    iconColor: "text-orange-600",
  },
];

type ClassStatus = "not_started" | "in_progress" | "completed";

export default function ModuleDetailClient() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = params.id as string;
  const moduleUUID = getModuleUUID(moduleId);
  const classId = searchParams.get("classId");

  const [activePhase, setActivePhase] = useState<Phase | null>("menulis");
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizPassed, setQuizPassed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModuleCompleted, setIsModuleCompleted] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [className, setClassName] = useState<string | null>(null);
  const [classStatus, setClassStatus] = useState<ClassStatus>("not_started");
  const [statusAnnouncement, setStatusAnnouncement] = useState("");
  const [isDuplicating, startDuplicateTransition] = useTransition();

  const learningModule = getModuleById(moduleId);
  const backPath = classId ? `/learn/kelas?classId=${classId}` : "/learn";

  useEffect(() => {
    async function loadProgress() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user && learningModule) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (profile?.role === "teacher") setIsTeacher(true);

        const { data } = await supabase
          .from("user_progress")
          .select("completed")
          .eq("user_id", user.id)
          .eq("module_id", moduleUUID)
          .maybeSingle();
        if (data) setIsModuleCompleted(data.completed || false);
        if (classId) {
          const [{ data: cls }, { data: cp }] = await Promise.all([
            supabase.from("classrooms").select("name").eq("id", classId).single(),
            supabase.from("class_progress").select("status")
              .eq("classroom_id", classId).eq("module_id", moduleUUID).maybeSingle(),
          ]);
          setClassName(cls?.name ?? null);
          setClassStatus((cp?.status as ClassStatus) ?? "not_started");
        }
      }
      setLoading(false);
    }
    loadProgress();
  }, [moduleId, moduleUUID, classId, learningModule]);

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
        <Button onClick={() => router.push("/learn")}>Kembali ke Kelas</Button>
      </div>
    );
  }

  const hasExercises = (learningModule.content.exercises?.length ?? 0) > 0;

  const handleRetryQuiz = () => {
    setQuizCompleted(false);
    setQuizScore(0);
    setQuizPassed(false);
  };

  const handleUpdateClassStatus = async (status: ClassStatus) => {
    if (!classId) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }
    const { error } = await supabase.from("class_progress").upsert(
      { classroom_id: classId, module_id: moduleUUID, status, updated_by: user.id, updated_at: new Date().toISOString() },
      { onConflict: "classroom_id,module_id" }
    );
    if (error) {
      toast.error("Gagal menyimpan progress kelas");
    } else {
      setClassStatus(status);
      setStatusAnnouncement(status === "completed" ? `Modul selesai diajarkan untuk kelas ${className}` : `Status diperbarui menjadi ${status}`);
      if (status === "completed") {
        toast.success("Modul selesai diajarkan!", { description: `Kelas ${className}` });
        setTimeout(() => router.push(backPath), 1500);
      } else {
        toast.success("Status diperbarui");
      }
    }
    setSaving(false);
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Silakan masuk terlebih dahulu"); setSaving(false); return; }
    try {
      const { error } = await supabase.from("user_progress").upsert(
        { user_id: user.id, module_id: moduleUUID, completed: true, score: quizScore || 100, completed_at: new Date().toISOString() },
        { onConflict: "user_id,module_id", ignoreDuplicates: false }
      );
      if (error) throw error;
      toast.success("Modul selesai!", { description: "Kerja bagus!" });
      setIsModuleCompleted(true);
      setTimeout(() => router.push("/learn"), 2000);
    } catch {
      toast.error("Gagal menyimpan progress");
    } finally {
      setSaving(false);
    }
  };

  const handleQuizComplete = async (score: number, answers: Record<string, string>) => {
    setQuizScore(score);
    setQuizCompleted(true);
    const passed = score >= PASSING_GRADE;
    setQuizPassed(passed);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("quiz_results").insert({
        user_id: user.id, module_id: moduleUUID, score, total_points: 100,
        correct_answers: Object.values(answers).filter((a) => a === "correct").length,
        total_questions: Object.keys(answers).length, answers,
      });
    }
    if (passed) {
      toast.success("Quiz lulus! 🎉", { description: `Skor: ${score}%` });
    } else {
      toast.error("Quiz belum lulus", { description: `Skor: ${score}%. Perlu minimal ${PASSING_GRADE}%.` });
    }
  };

  const difficultyColor = learningModule.difficulty === "beginner"
    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    : learningModule.difficulty === "intermediate"
    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={() => router.push(backPath)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />Kembali
        </Button>
        {className && (
          <div className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-lg bg-primary/5 border border-primary/20 w-fit">
            <School className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm font-medium">Mengajar untuk:</span>
            <span className="text-sm font-bold text-primary">{className}</span>
            {classStatus === "in_progress" && (
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 ml-1">Sedang Diajarkan</Badge>
            )}
            {classStatus === "completed" && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 ml-1">
                <CheckCircle2 className="w-3 h-3 mr-1" />Selesai Diajarkan
              </Badge>
            )}
          </div>
        )}
        <div id="module-title" className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{learningModule.title}</h1>
            <p className="text-muted-foreground mt-1">{learningModule.description}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge className={difficultyColor}>{learningModule.difficulty}</Badge>
            {isModuleCompleted && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <CheckCircle2 className="w-3 h-3 mr-1" />Selesai
              </Badge>
            )}
          </div>
        </div>
      </div>

      {!showQuiz && (
        <div id="phase-selector">
          <h2 className="text-base font-semibold mb-3 text-muted-foreground uppercase tracking-wide text-xs">Pilih Fase Belajar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PHASES.map((phase) => {
              const Icon = phase.icon;
              const isActive = activePhase === phase.id;
              return (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(isActive ? null : phase.id)}
                  aria-label={`Pilih fase ${phase.label}`}
                  aria-pressed={isActive}
                  className={`rounded-xl border-2 p-4 text-left transition-all cursor-pointer ${isActive ? phase.activeBg : `bg-card ${phase.border}`} hover:opacity-90`}>
                  <Icon className={`h-6 w-6 mb-2 ${phase.iconColor}`} aria-hidden="true" />
                  <p className="font-semibold text-sm">{phase.label}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">{phase.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!showQuiz && activePhase === "menulis" && <PhaseMenulis lessons={learningModule.content.lessons} />}
      {!showQuiz && activePhase === "mendengarkan" && <PhaseMendengarkan lessons={learningModule.content.lessons} />}
      {!showQuiz && activePhase === "membaca" && <PhaseMembaca lessons={learningModule.content.lessons} />}
      {!showQuiz && activePhase === "berbicara" && <PhaseBerbicara lessons={learningModule.content.lessons} moduleId={moduleId} />}

      {showQuiz && hasExercises && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setShowQuiz(false)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-bold">Quiz Modul</h2>
            <Badge variant="outline" className="ml-auto">Minimum {PASSING_GRADE}%</Badge>
          </div>
          {!quizCompleted ? (
            <QuizComponent exercises={learningModule.content.exercises!} onComplete={handleQuizComplete} />
          ) : (
            <div className="space-y-4">
              <Card className={quizPassed ? "border-green-500" : "border-destructive"}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {quizPassed ? <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" /> : <XCircle className="h-8 w-8 text-destructive shrink-0" />}
                    <div>
                      <CardTitle className={quizPassed ? "text-green-700" : "text-destructive"}>
                        {quizPassed ? "Quiz Lulus! 🎉" : "Quiz Belum Lulus"}
                      </CardTitle>
                      <CardDescription>Skor: {quizScore}% — Minimum: {PASSING_GRADE}%</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              <div className="flex gap-3">
                {!quizPassed && <Button variant="outline" onClick={handleRetryQuiz} className="flex-1"><RefreshCw className="h-4 w-4 mr-2" />Coba Lagi</Button>}
                {quizPassed && <Button onClick={handleCompleteModule} disabled={saving} className="flex-1">{saving ? "Menyimpan..." : "Selesaikan Modul"}</Button>}
              </div>
            </div>
          )}
        </div>
      )}

      {!showQuiz && (
        <Card id="module-actions">
          <CardContent className="pt-6 space-y-3">
            {hasExercises && (
              <Button variant="outline" onClick={() => setShowQuiz(true)} className="w-full">
                <ClipboardList className="h-4 w-4 mr-2" />
                {quizPassed ? `Quiz Selesai (${quizScore}%)` : "Ambil Quiz"}
              </Button>
            )}
            {classId ? (
              <div className="flex gap-3 flex-wrap">
                {classStatus === "not_started" && (
                  <Button onClick={() => handleUpdateClassStatus("in_progress")} disabled={saving} variant="outline" className="flex-1">
                    <Play className="h-4 w-4 mr-2" />{saving ? "Menyimpan..." : "Mulai Mengajarkan"}
                  </Button>
                )}
                <Button onClick={() => handleUpdateClassStatus("completed")} disabled={saving || classStatus === "completed"} className="flex-1">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {saving ? "Menyimpan..." : classStatus === "completed" ? "Sudah Selesai Diajarkan ✓" : "Selesai Diajarkan"}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button onClick={handleCompleteModule} disabled={saving || isModuleCompleted || (hasExercises && !quizPassed)} className="w-full">
                  {saving ? "Menyimpan..." : isModuleCompleted ? "Modul Sudah Selesai ✓" : "Selesaikan Modul"}
                </Button>
                {hasExercises && !quizPassed && (
                  <p className="text-xs text-muted-foreground text-center">Lulus quiz terlebih dahulu untuk menyelesaikan modul</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isTeacher && (
        <Card>
          <CardContent className="pt-6">
            <Button
              variant="outline"
              className="w-full"
              disabled={isDuplicating}
              onClick={() => {
                startDuplicateTransition(async () => {
                  const result = await duplicateModule(moduleId);
                  if (result.success && result.newId) {
                    setStatusAnnouncement("Modul berhasil diduplikasi. Mengalihkan ke halaman edit.");
                    router.push(`/materi/${result.newId}/edit`);
                  } else {
                    toast.error(result.error ?? "Gagal menduplikasi modul");
                  }
                });
              }}
            >
              <CopyPlus className="h-4 w-4 mr-2" />
              {isDuplicating ? "Menduplikasi..." : "Duplikasi ke Materi Saya"}
            </Button>
          </CardContent>
        </Card>
      )}

      <TutorialDriver steps={moduleDetailSteps} storageKey="bralingo-tutorial-module-detail" />

      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {statusAnnouncement}
      </div>
    </div>
  );
}
