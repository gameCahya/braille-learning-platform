"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getPrePostTest } from "@/lib/data/pre-post-tests";
import { reviewEssay } from "@/app/(dashboard)/prepost-test/_actions/review-essay";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  ClipboardCheck,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Save,
  Users,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import type { PrePostTestData, PrePostEssayResult } from "@/types";

// ──────────────────────────────────────────
// Types
// ──────────────────────────────────────────

interface Student {
  id: string;
  full_name: string;
}

interface PendingResult {
  id: string;
  student_id: string;
  teacher_id: string;
  module_id: string;
  test_type: "pre" | "post";
  score: number;
  score_normalized: number;
  mcq_score: number;
  essay_score: number;
  answers: Array<{
    questionId: number;
    question: string;
    questionType: "mcq" | "essay";
    userAnswer: string | null;
    correctAnswer: string | string[];
    isCorrect: boolean | null;
  }>;
  essay_results: PrePostEssayResult[];
  status: "completed" | "pending_review";
  created_at: string;
  updated_at: string;
}

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getScoreBadge(score: number | null | undefined): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  if (score === null || score === undefined) return { label: "Belum Dinilai", variant: "outline" };
  if (score === 10) return { label: "Benar (10)", variant: "default" };
  if (score === 5) return { label: "Cukup (5)", variant: "secondary" };
  return { label: "Salah (0)", variant: "destructive" };
}

// ──────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────

function PendingListCard({
  result,
  studentName,
  isSelected,
  onSelect,
}: {
  result: PendingResult;
  studentName: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const testData = getPrePostTest(result.module_id);
  const moduleTitle = testData?.moduleTitle ?? result.module_id;

  return (
    <Card
      className={`cursor-pointer transition-all hover:border-primary/50 ${
        isSelected ? "border-primary ring-1 ring-primary" : ""
      }`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-label={`Review ${result.test_type === "pre" ? "Pre-Test" : "Post-Test"} ${moduleTitle} — ${studentName}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-base leading-snug">{studentName}</CardTitle>
            <CardDescription className="text-xs">{moduleTitle}</CardDescription>
          </div>
          <Badge variant={result.test_type === "pre" ? "secondary" : "default"}>
            {result.test_type === "pre" ? "Pre-Test" : "Post-Test"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          {formatDate(result.created_at)}
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
          {result.essay_results?.length ?? 0} soal essay perlu review
        </div>
      </CardContent>
    </Card>
  );
}

function EssayReviewItem({
  essayResult,
  testData,
  currentScore,
  onScoreChange,
}: {
  essayResult: PrePostEssayResult;
  testData: PrePostTestData;
  currentScore: 0 | 5 | 10;
  onScoreChange: (questionId: number, score: 0 | 5 | 10) => void;
}) {
  // Cari soal dari data test untuk menampilkan accepted answers lengkap
  const question = testData.questions.find(
    (q) => q.id === essayResult.questionId && q.type === "essay"
  );
  const acceptedAnswers = question?.answer as string[] ?? essayResult.acceptedAnswers ?? [];

  return (
    <Card key={essayResult.questionId} className="border-l-4 border-l-primary/30">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">
              Soal #{essayResult.questionId}
            </CardTitle>
            <CardDescription className="text-sm">
              {essayResult.question}
            </CardDescription>
          </div>
          <Badge variant={getScoreBadge(currentScore).variant} className="shrink-0">
            {getScoreBadge(currentScore).label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Jawaban Siswa */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Jawaban Siswa:</p>
          <div className="rounded-md bg-muted/50 p-3 text-sm">
            {essayResult.userAnswer || (
              <span className="italic text-muted-foreground">(tidak dijawab)</span>
            )}
          </div>
        </div>

        {/* Kunci Jawaban */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Kunci Jawaban:</p>
          <div className="flex flex-wrap gap-1.5">
            {acceptedAnswers.length > 0 ? (
              acceptedAnswers.map((answer, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {answer}
                </Badge>
              ))
            ) : (
              <span className="text-xs italic text-muted-foreground">(tidak ada kunci)</span>
            )}
          </div>
        </div>

        {/* Skor Otomatis */}
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium text-muted-foreground">Skor Otomatis:</p>
          <Badge variant="secondary" className="text-xs">
            {essayResult.score}/10
          </Badge>
        </div>

        {/* Penilaian Manual */}
        <div className="flex items-center gap-3 pt-1">
          <p className="text-xs font-medium text-muted-foreground">Nilai Manual:</p>
          <Select
            value={String(currentScore)}
            onValueChange={(val) =>
              onScoreChange(essayResult.questionId, Number(val) as 0 | 5 | 10)
            }
          >
            <SelectTrigger className="w-[160px]" aria-label={`Nilai soal #${essayResult.questionId}`}>
              <SelectValue placeholder="Pilih nilai..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" aria-hidden="true" />
                  Benar — 10 pts
                </span>
              </SelectItem>
              <SelectItem value="5">
                <span className="flex items-center gap-2">
                  <HelpCircle className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
                  Cukup — 5 pts
                </span>
              </SelectItem>
              <SelectItem value="0">
                <span className="flex items-center gap-2">
                  <XCircle className="h-3.5 w-3.5 text-red-600" aria-hidden="true" />
                  Salah — 0 pts
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

// ──────────────────────────────────────────
// Review Detail Panel
// ──────────────────────────────────────────

function ReviewDetailPanel({
  result,
  studentName,
  onBack,
  onSaved,
}: {
  result: PendingResult;
  studentName: string;
  onBack: () => void;
  onSaved: () => void;
}) {
  const testData = getPrePostTest(result.module_id);
  const [scores, setScores] = useState<Record<number, 0 | 5 | 10>>(() => {
    const initial: Record<number, 0 | 5 | 10> = {};
    for (const er of result.essay_results || []) {
      initial[er.questionId] = er.score ?? 0;
    }
    return initial;
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleScoreChange = useCallback(
    (questionId: number, score: 0 | 5 | 10) => {
      setScores((prev) => ({ ...prev, [questionId]: score }));
    },
    []
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const essayScores = Object.entries(scores).map(([questionId, score]) => ({
      questionId: Number(questionId),
      score,
    }));

    const res = await reviewEssay(result.id, essayScores);

    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => {
        onSaved();
      }, 1200);
    } else {
      setSaveError(res.error ?? "Gagal menyimpan review.");
    }

    setSaving(false);
  }, [result.id, scores, onSaved]);

  if (!testData) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-16 gap-3">
          <AlertCircle className="h-10 w-10 text-destructive" aria-hidden="true" />
          <p className="text-lg font-medium text-foreground">Data modul tidak ditemukan</p>
          <Button variant="outline" onClick={onBack}>
            Kembali
          </Button>
        </CardContent>
      </Card>
    );
  }

  const totalEssayScore = Object.values(scores).reduce<number>((sum, s) => sum + s, 0);
  const totalScore = (result.mcq_score || 0) + totalEssayScore;
  const normalized = Math.round((totalScore / 75) * 100);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
          Kembali ke daftar
        </Button>
      </div>

      {/* Header info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="space-y-1">
              <CardTitle className="text-lg">
                Review Essay — {studentName}
              </CardTitle>
              <CardDescription>
                {testData.moduleTitle} ·{" "}
                {result.test_type === "pre" ? "Pre-Test" : "Post-Test"} ·{" "}
                {formatDate(result.created_at)}
              </CardDescription>
            </div>
            <Badge
              variant={result.test_type === "pre" ? "secondary" : "default"}
              className="text-xs"
            >
              {result.test_type === "pre" ? "Pre-Test" : "Post-Test"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Skor MCQ:</span>
              <span className="font-medium">{result.mcq_score}/25</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Skor Essay (sementara):</span>
              <span className="font-medium">{totalEssayScore}/50</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">{totalScore}/75</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Normalisasi:</span>
              <span className="font-bold">{normalized}/100</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Essay questions */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <FileText className="h-4 w-4" aria-hidden="true" />
          Soal Essay ({result.essay_results?.length ?? 0})
        </h2>

        {(result.essay_results ?? []).length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center py-12 gap-3">
              <HelpCircle className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
              <p className="text-muted-foreground">Tidak ada soal essay yang perlu direview.</p>
              <Button variant="outline" size="sm" onClick={onBack}>
                Kembali
              </Button>
            </CardContent>
          </Card>
        )}

        {(result.essay_results ?? []).map((er) => (
          <EssayReviewItem
            key={er.questionId}
            essayResult={er}
            testData={testData}
            currentScore={scores[er.questionId] ?? er.score ?? 0}
            onScoreChange={handleScoreChange}
          />
        ))}
      </div>

      {/* Save section */}
      <Card className="sticky bottom-4">
        <CardContent className="flex items-center justify-between py-4">
          <div className="space-y-1">
            {saveSuccess && (
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Review berhasil disimpan! Mengalihkan...
              </p>
            )}
            {saveError && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {saveError}
              </p>
            )}
            {!saveSuccess && !saveError && (
              <p className="text-sm text-muted-foreground">
                Total nilai essay: {totalEssayScore}/50
              </p>
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={saving || saveSuccess}
            size="lg"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                Menyimpan...
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" aria-hidden="true" />
                Tersimpan
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" aria-hidden="true" />
                Simpan Review
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ──────────────────────────────────────────
// Main Page Component
// ──────────────────────────────────────────

export default function PrePostReviewPage() {
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Students
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsMap, setStudentsMap] = useState<Record<string, string>>({});

  // Pending results
  const [pendingResults, setPendingResults] = useState<PendingResult[]>([]);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);

  // ── Fetch user + students ──
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (!authUser) {
        setError("Silakan login terlebih dahulu.");
        setLoading(false);
        return;
      }

      supabase
        .from("profiles")
        .select("role")
        .eq("id", authUser.id)
        .single()
        .then(({ data: profile }) => {
          const role = profile?.role ?? "teacher";
          setUser({ id: authUser.id, role });

          if (role !== "teacher") {
            setError("Halaman ini hanya untuk guru.");
            setLoading(false);
            return;
          }

          // Ambil daftar siswa guru ini
          supabase
            .from("students")
            .select("id, full_name")
            .eq("teacher_id", authUser.id)
            .order("full_name", { ascending: true })
            .then(({ data: studentData }) => {
              const studentList = studentData ?? [];
              setStudents(studentList);
              const map: Record<string, string> = {};
              for (const s of studentList) {
                map[s.id] = s.full_name;
              }
              setStudentsMap(map);

              // Ambil semua hasil pending_review untuk siswa-siswa ini
              const studentIds = studentList.map((s) => s.id);
              if (studentIds.length > 0) {
                supabase
                  .from("pre_post_results" as any)
                  .select("*")
                  .in("student_id", studentIds)
                  .eq("status", "pending_review")
                  .order("created_at", { ascending: false })
                  .then(({ data, error: fetchError }: { data: any; error: any }) => {
                    if (fetchError) {
                      setError(fetchError.message);
                    } else {
                      setPendingResults((data ?? []) as unknown as PendingResult[]);
                    }
                    setLoading(false);
                  });
              } else {
                setLoading(false);
              }
            });
        });
    });
  }, []);

  // Selected result
  const selectedResult = pendingResults.find(
    (r) => r.id === selectedResultId
  ) ?? null;
  const selectedStudentName = selectedResult
    ? studentsMap[selectedResult.student_id] ?? "Siswa"
    : "";

  const handleSelectResult = useCallback((id: string) => {
    setSelectedResultId(id);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedResultId(null);
  }, []);

  const handleSaved = useCallback(() => {
    // Remove from list and go back
    setPendingResults((prev) => prev.filter((r) => r.id !== selectedResultId));
    setSelectedResultId(null);
  }, [selectedResultId]);

  // ── Render ──

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" aria-hidden="true" />
        <p className="text-lg font-medium text-foreground">{error}</p>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            Kembali ke Beranda <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
        <p className="text-muted-foreground">Memuat data review...</p>
      </div>
    );
  }

  // Detail view
  if (selectedResult) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <ReviewDetailPanel
          result={selectedResult}
          studentName={selectedStudentName}
          onBack={handleBack}
          onSaved={handleSaved}
        />
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ClipboardCheck className="h-7 w-7 text-primary" aria-hidden="true" />
          Review Essay
        </h1>
        <p className="text-muted-foreground mt-1">
          Nilai jawaban essay siswa yang membutuhkan review manual.
        </p>
      </div>

      {/* Empty state */}
      {pendingResults.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center py-16 gap-3">
            <CheckCircle2 className="h-10 w-10 text-green-500" aria-hidden="true" />
            <p className="text-lg font-medium text-foreground">
              Tidak ada essay yang perlu direview
            </p>
            <p className="text-sm text-muted-foreground">
              Semua jawaban essay sudah dinilai secara otomatis atau sudah selesai direview.
            </p>
            <Button variant="outline" asChild>
              <Link href="/prepost-test">
                <FileText className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Lihat Pre & Post Test
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pending list */}
      {pendingResults.length > 0 && (
        <>
          {/* Summary */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm">
                    <strong>{students.length}</strong> siswa terdaftar
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-amber-500" aria-hidden="true" />
                  <span className="text-sm">
                    <strong>{pendingResults.length}</strong> hasil menunggu review
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grid of pending results */}
          <section aria-label="Daftar hasil yang perlu direview">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pendingResults.map((result) => (
                <PendingListCard
                  key={result.id}
                  result={result}
                  studentName={studentsMap[result.student_id] ?? "Siswa"}
                  isSelected={result.id === selectedResultId}
                  onSelect={() => handleSelectResult(result.id)}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
