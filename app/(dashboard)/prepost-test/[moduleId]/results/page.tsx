"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExportButton } from "@/components/ExportButton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  ArrowUp,
  ArrowDown,
  Minus,
  TrendingUp,
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { getCategory } from "@/lib/data/pre-post-tests/scoring";

// ──────────────────────────────────────────
// Types
// ──────────────────────────────────────────

interface Student {
  id: string;
  full_name: string;
}

interface PrePostResult {
  id: string;
  student_id: string;
  teacher_id: string;
  module_id: string;
  test_type: "pre" | "post";
  attempt: number;
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
  essay_results: Array<{
    questionId: number;
    question: string;
    userAnswer: string;
    acceptedAnswers: string[];
    score: 0 | 5 | 10;
  }>;
  status: "completed" | "pending_review";
  created_at: string;
  updated_at: string;
}

interface ScoreData {
  label: string;
  score: number;
  normalized: number;
  mcqScore: number;
  essayScore: number;
  category: string;
}

interface ChartDataItem {
  name: string;
  Pre: number;
  Post: number;
}

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────

function getScoreColor(score: number): string {
  if (score >= 75) return "text-green-600 dark:text-green-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getScoreBg(score: number): string {
  if (score >= 75) return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
  if (score >= 50) return "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800";
  return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
}

function getCategoryBadgeVariant(category: string): "default" | "secondary" | "destructive" | "outline" {
  switch (category) {
    case "Sangat Tinggi":
    case "Tinggi":
      return "default";
    case "Sedang":
      return "secondary";
    case "Rendah":
      return "outline";
    case "Sangat Rendah":
      return "destructive";
    default:
      return "outline";
  }
}

function getDiffIcon(diff: number) {
  if (diff > 0) return { icon: ArrowUp, color: "text-green-600" };
  if (diff < 0) return { icon: ArrowDown, color: "text-red-600" };
  return { icon: Minus, color: "text-muted-foreground" };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ──────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────

export default function PrePostResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const moduleId = params?.moduleId as string;
  const initialStudentId = searchParams?.get("studentId") ?? null;

  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Students (for teacher)
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(initialStudentId);

  // Results
  const [results, setResults] = useState<PrePostResult[]>([]);

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

          // If teacher, fetch students
          if (role === "teacher") {
            supabase
              .from("students")
              .select("id, full_name")
              .eq("teacher_id", authUser.id)
              .order("full_name", { ascending: true })
              .then(({ data: studentData }) => {
                setStudents(studentData ?? []);
                setLoading(false);
              });
          } else {
            // Student: find their student record
            supabase
              .from("students")
              .select("id")
              .eq("teacher_id", authUser.id)
              .single()
              .then(({ data: studentRecord }) => {
                if (studentRecord) {
                  setSelectedStudentId(studentRecord.id);
                }
                setLoading(false);
              });
          }
        });
    });
  }, []);

  // ── When student selected, fetch results ──
  useEffect(() => {
    if (!selectedStudentId || !moduleId) return;

    const supabase = createClient();
    setLoading(true);

    // pre_post_results table belum ada di generated types,
    // pakai (as any) agar TypeScript tidak error
    supabase
      .from("pre_post_results" as any)
      .select("*")
      .eq("student_id", selectedStudentId)
      .eq("module_id", moduleId)
      .in("test_type", ["pre", "post"])
      .order("test_type", { ascending: true })
      .then(({ data, error: fetchError }: { data: any; error: any }) => {
        if (fetchError) {
          setError(fetchError.message);
        } else {
          setResults((data ?? []) as unknown as PrePostResult[]);
        }
        setLoading(false);
      });
  }, [selectedStudentId, moduleId]);

  // ── Handle student selection change ──
  const handleStudentChange = useCallback(
    (value: string) => {
      setSelectedStudentId(value);
      router.replace(`/prepost-test/${moduleId}/results?studentId=${value}`);
    },
    [moduleId, router]
  );

  // ── Derive data ──
  const preResult = results.find((r) => r.test_type === "pre");
  const postResult = results.find((r) => r.test_type === "post");

  const preScore: ScoreData | null = preResult
    ? {
        label: "Pre-Test",
        score: preResult.score,
        normalized: preResult.score_normalized,
        mcqScore: preResult.mcq_score,
        essayScore: preResult.essay_score,
        category: getCategory(preResult.score_normalized),
      }
    : null;

  const postScore: ScoreData | null = postResult
    ? {
        label: "Post-Test",
        score: postResult.score,
        normalized: postResult.score_normalized,
        mcqScore: postResult.mcq_score,
        essayScore: postResult.essay_score,
        category: getCategory(postResult.score_normalized),
      }
    : null;

  const difference =
    preScore && postScore ? postScore.normalized - preScore.normalized : null;

  const diffInfo = difference !== null ? getDiffIcon(difference) : null;

  // Chart data — perbandingan MCQ vs Essay
  const chartData: ChartDataItem[] = [
    {
      name: "Total",
      Pre: preScore?.normalized ?? 0,
      Post: postScore?.normalized ?? 0,
    },
    {
      name: "MCQ",
      Pre: preScore
        ? Math.round((preScore.mcqScore / 25) * 100)
        : 0,
      Post: postScore
        ? Math.round((postScore.mcqScore / 25) * 100)
        : 0,
    },
    {
      name: "Essay",
      Pre: preScore
        ? Math.round((preScore.essayScore / 50) * 100)
        : 0,
      Post: postScore
        ? Math.round((postScore.essayScore / 50) * 100)
        : 0,
    },
  ];

  // CSV export data
  const csvData: Record<string, string | number>[] = [];

  if (preResult?.answers) {
    preResult.answers.forEach((ans, idx) => {
      const postAnswer = postResult?.answers?.[idx];
      csvData.push({
        "No. Soal": idx + 1,
        "Pertanyaan": ans.question,
        "Tipe": ans.questionType === "mcq" ? "Pilihan Ganda" : "Esai",
        "Jawaban Pre": ans.userAnswer ?? "-",
        "Jawaban Post": postAnswer?.userAnswer ?? "-",
        "Benar Pre": ans.isCorrect === true ? "Ya" : ans.isCorrect === false ? "Tidak" : "Review",
        "Benar Post": postAnswer?.isCorrect === true ? "Ya" : postAnswer?.isCorrect === false ? "Tidak" : "Review",
      });
    });
  }

  const selectedStudentName =
    students.find((s) => s.id === selectedStudentId)?.full_name ?? "Siswa";

  // ── Render ──
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" aria-hidden="true" />
        <p className="text-lg font-medium text-foreground">{error}</p>
        <Link
          href="/reports"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          Kembali ke laporan <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Hasil Pre & Post Test
            </h1>
            <p className="text-muted-foreground mt-1">
              Modul: <span className="font-medium text-foreground">{moduleId}</span>
              {selectedStudentName && (
                <>
                  {" · "}Siswa:{" "}
                  <span className="font-medium text-foreground">{selectedStudentName}</span>
                </>
              )}
            </p>
          </div>

          {/* Student selector (guru only) */}
          {user?.role === "teacher" && (
            <div className="flex items-center gap-3">
              <label htmlFor="student-select" className="text-sm font-medium text-foreground whitespace-nowrap">
                Pilih Siswa
              </label>
              <Select
                value={selectedStudentId ?? undefined}
                onValueChange={handleStudentChange}
              >
                <SelectTrigger id="student-select" className="w-[220px]" aria-label="Pilih siswa untuk melihat hasil">
                  <SelectValue placeholder="Pilih siswa..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center min-h-[40vh] gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
          <p className="text-muted-foreground">Memuat data hasil test...</p>
        </div>
      )}

      {/* No student selected */}
      {!loading && !selectedStudentId && (
        <Card>
          <CardContent className="flex flex-col items-center py-16 gap-3">
            <TrendingUp className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <p className="text-lg font-medium text-foreground">
              {user?.role === "teacher"
                ? "Pilih siswa untuk melihat hasil test"
                : "Belum ada data hasil test"}
            </p>
            <p className="text-sm text-muted-foreground">
              {user?.role === "teacher"
                ? "Gunakan dropdown di atas untuk memilih siswa."
                : "Kerjakan pre-test dan post-test untuk melihat hasil."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* No results found */}
      {!loading && selectedStudentId && results.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center py-16 gap-3">
            <AlertCircle className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <p className="text-lg font-medium text-foreground">
              Belum ada hasil test untuk modul ini
            </p>
            <p className="text-sm text-muted-foreground">
              Siswa perlu menyelesaikan pre-test dan post-test terlebih dahulu.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {!loading && selectedStudentId && results.length > 0 && (
        <>
          {/* ── Score Comparison Cards ── */}
          <section aria-label="Perbandingan skor pre-test dan post-test">
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Pre-Test Card */}
              <Card className={preScore ? getScoreBg(preScore.normalized) : "opacity-60"}>
                <CardHeader>
                  <CardTitle className="text-base">Pre-Test</CardTitle>
                  {preScore && (
                    <CardDescription>
                      {formatDate(preResult!.created_at)}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {preScore ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-3xl font-bold ${getScoreColor(preScore.normalized)}`}>
                          {preScore.normalized}
                        </span>
                        <span className="text-sm text-muted-foreground">/ 100</span>
                      </div>
                      <Badge variant={getCategoryBadgeVariant(preScore.category)}>
                        {preScore.category}
                      </Badge>
                      <div className="text-xs text-muted-foreground space-y-1 pt-2">
                        <p>Skor mentah: {preScore.score} / 75</p>
                        <p>MCQ: {preScore.mcqScore} / 25</p>
                        <p>Esai: {preScore.essayScore} / 50</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Belum dikerjakan</p>
                  )}
                </CardContent>
              </Card>

              {/* Selisih Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Selisih</CardTitle>
                  <CardDescription>Perubahan nilai</CardDescription>
                </CardHeader>
                <CardContent>
                  {difference !== null ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        {diffInfo && (
                          <diffInfo.icon
                            className={`h-8 w-8 ${diffInfo.color}`}
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className={`text-3xl font-bold ${
                            difference > 0
                              ? "text-green-600 dark:text-green-400"
                              : difference < 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-muted-foreground"
                          }`}
                        >
                          {difference > 0 ? "+" : ""}
                          {difference}
                        </span>
                        <span className="text-sm text-muted-foreground">poin</span>
                      </div>
                      <Badge
                        variant={
                          difference > 0
                            ? "default"
                            : difference < 0
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {difference > 0
                          ? "Meningkat"
                          : difference < 0
                          ? "Menurun"
                          : "Tidak berubah"}
                      </Badge>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {!preScore
                        ? "Kerjakan pre-test terlebih dahulu"
                        : "Kerjakan post-test untuk melihat selisih"}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Post-Test Card */}
              <Card className={postScore ? getScoreBg(postScore.normalized) : "opacity-60"}>
                <CardHeader>
                  <CardTitle className="text-base">Post-Test</CardTitle>
                  {postScore && (
                    <CardDescription>
                      {formatDate(postResult!.created_at)}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {postScore ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-3xl font-bold ${getScoreColor(postScore.normalized)}`}>
                          {postScore.normalized}
                        </span>
                        <span className="text-sm text-muted-foreground">/ 100</span>
                      </div>
                      <Badge variant={getCategoryBadgeVariant(postScore.category)}>
                        {postScore.category}
                      </Badge>
                      <div className="text-xs text-muted-foreground space-y-1 pt-2">
                        <p>Skor mentah: {postScore.score} / 75</p>
                        <p>MCQ: {postScore.mcqScore} / 25</p>
                        <p>Esai: {postScore.essayScore} / 50</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Belum dikerjakan</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* ── Bar Chart ── */}
          <section aria-label="Grafik perbandingan skor">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Grafik Perbandingan</CardTitle>
                <CardDescription>
                  Perbandingan skor pre-test dan post-test per kategori
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full" role="img" aria-label="Grafik batang perbandingan skor pre dan post test">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tickFormatter={(v) => `${v}%`}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--card-foreground))",
                        }}
                        formatter={(value: any) => [`${value ?? 0}%`]}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: 12 }}
                      />
                      <Bar
                        dataKey="Pre"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                        name="Pre-Test"
                        aria-label="Pre-Test"
                      />
                      <Bar
                        dataKey="Post"
                        fill="#22c55e"
                        radius={[4, 4, 0, 0]}
                        name="Post-Test"
                        aria-label="Post-Test"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ── Detailed Comparison Table ── */}
          <section aria-label="Perbandingan detail per soal">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Perbandingan Detail Per Soal</CardTitle>
                  <CardDescription>
                    {preResult?.answers?.length ?? 0} soal pre-test vs{" "}
                    {postResult?.answers?.length ?? 0} soal post-test
                  </CardDescription>
                </div>
                {csvData.length > 0 && (
                  <ExportButton
                    data={csvData}
                    filename={`perbandingan-${moduleId}-${selectedStudentId ?? "siswa"}-${new Date().toISOString().split("T")[0]}`}
                    label="Export CSV"
                  />
                )}
              </CardHeader>
              <CardContent className="p-0">
                <Table aria-label="Tabel perbandingan jawaban per soal">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">No</TableHead>
                      <TableHead>Pertanyaan</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Jawaban Pre</TableHead>
                      <TableHead className="text-center">Pre</TableHead>
                      <TableHead>Jawaban Post</TableHead>
                      <TableHead className="text-center">Post</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(preResult?.answers ?? []).length === 0 &&
                    (postResult?.answers ?? []).length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-muted-foreground py-8"
                        >
                          Belum ada data jawaban
                        </TableCell>
                      </TableRow>
                    ) : (
                      (preResult?.answers ?? []).map((ans, idx) => {
                        const postAns = postResult?.answers?.[idx];
                        return (
                          <TableRow key={ans.questionId ?? idx}>
                            <TableCell className="text-center font-medium">
                              {idx + 1}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate" title={ans.question}>
                              {ans.question}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {ans.questionType === "mcq" ? "PG" : "Esai"}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[150px] truncate" title={ans.userAnswer ?? undefined}>
                              {ans.userAnswer ?? (
                                <span className="text-muted-foreground italic">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {ans.isCorrect === true ? (
                                <Badge
                                  variant="default"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Benar
                                </Badge>
                              ) : ans.isCorrect === false ? (
                                <Badge variant="destructive">Salah</Badge>
                              ) : (
                                <Badge variant="outline">Review</Badge>
                              )}
                            </TableCell>
                            <TableCell className="max-w-[150px] truncate" title={postAns?.userAnswer ?? undefined}>
                              {postAns?.userAnswer ?? (
                                <span className="text-muted-foreground italic">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {postAns?.isCorrect === true ? (
                                <Badge
                                  variant="default"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Benar
                                </Badge>
                              ) : postAns?.isCorrect === false ? (
                                <Badge variant="destructive">Salah</Badge>
                              ) : (
                                <Badge variant="outline">
                                  {postAns ? "Review" : "-"}
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          {/* ── Results metadata ── */}
          <div className="grid gap-4 sm:grid-cols-2">
            {preResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Detail Pre-Test</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  <p>
                    Status:{" "}
                    <Badge
                      variant={preResult.status === "completed" ? "default" : "outline"}
                      className="ml-1"
                    >
                      {preResult.status === "completed" ? "Selesai" : "Menunggu Review"}
                    </Badge>
                  </p>
                  <p>
                    Attempt:{" "}
                    <span className="font-medium text-foreground">
                      {preResult.attempt}
                    </span>
                  </p>
                  <p>
                    Skor MCQ:{" "}
                    <span className="font-medium text-foreground">
                      {preResult.mcq_score} / 25
                    </span>
                  </p>
                  <p>
                    Skor Esai:{" "}
                    <span className="font-medium text-foreground">
                      {preResult.essay_score} / 50
                    </span>
                  </p>
                  <p>
                    Total:{" "}
                    <span className="font-medium text-foreground">
                      {preResult.score} / 75
                    </span>
                  </p>
                  <p>
                    Dinormalisasi:{" "}
                    <span className="font-medium text-foreground">
                      {preResult.score_normalized} / 100
                    </span>
                  </p>
                  <p>Dikerjakan: {formatDate(preResult.created_at)}</p>
                </CardContent>
              </Card>
            )}

            {postResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Detail Post-Test</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  <p>
                    Status:{" "}
                    <Badge
                      variant={postResult.status === "completed" ? "default" : "outline"}
                      className="ml-1"
                    >
                      {postResult.status === "completed" ? "Selesai" : "Menunggu Review"}
                    </Badge>
                  </p>
                  <p>
                    Attempt:{" "}
                    <span className="font-medium text-foreground">
                      {postResult.attempt}
                    </span>
                  </p>
                  <p>
                    Skor MCQ:{" "}
                    <span className="font-medium text-foreground">
                      {postResult.mcq_score} / 25
                    </span>
                  </p>
                  <p>
                    Skor Esai:{" "}
                    <span className="font-medium text-foreground">
                      {postResult.essay_score} / 50
                    </span>
                  </p>
                  <p>
                    Total:{" "}
                    <span className="font-medium text-foreground">
                      {postResult.score} / 75
                    </span>
                  </p>
                  <p>
                    Dinormalisasi:{" "}
                    <span className="font-medium text-foreground">
                      {postResult.score_normalized} / 100
                    </span>
                  </p>
                  <p>Dikerjakan: {formatDate(postResult.created_at)}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}
