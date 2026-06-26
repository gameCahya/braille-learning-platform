"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PrePostTestData } from "@/types";
import { getCategory, normalizeScore } from "@/lib/data/pre-post-tests/scoring";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  BarChart3,
  ClipboardList,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// ── Tipe lokal ──
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
}

interface StudentRow {
  student_id: string;
  student_name: string;
  pre_score: number | null;
  post_score: number | null;
  pre_normalized: number | null;
  post_normalized: number | null;
}

interface ChartData {
  name: string;
  Pre: number;
  Post: number;
}

// ── Color helpers ──
function categoryColor(cat: string): string {
  switch (cat) {
    case "Sangat Tinggi":
      return "bg-green-100 text-green-800 border-green-200";
    case "Tinggi":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Sedang":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "Rendah":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Sangat Rendah":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function diffColor(diff: number): string {
  if (diff > 0) return "text-green-600";
  if (diff < 0) return "text-red-600";
  return "text-muted-foreground";
}

function diffIcon(diff: number) {
  if (diff > 0) return <ArrowUp className="h-3.5 w-3.5 text-green-600" aria-hidden="true" />;
  if (diff < 0) return <ArrowDown className="h-3.5 w-3.5 text-red-600" aria-hidden="true" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />;
}

// ── Props ──
interface Props {
  prePostTests: PrePostTestData[];
  initialStudents: Array<{ id: string; full_name: string }>;
  teacherId: string;
}

// ── Component ──
export function PrePostTestSection({
  prePostTests,
  initialStudents,
  teacherId,
}: Props) {
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [students] = useState(initialStudents);
  const [allResults, setAllResults] = useState<PrePostResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch results when module changes ──
  useEffect(() => {
    if (!selectedModule) {
      setAllResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    (supabase.from("pre_post_results" as any) as any)
      .select("*")
      .eq("teacher_id", teacherId)
      .eq("module_id", selectedModule)
      .in("test_type", ["pre", "post"])
      .order("test_type", { ascending: true })
      .then(({ data, error: fetchError }: { data: any; error: any }) => {
        if (fetchError) {
          setError(fetchError.message);
        } else {
          setAllResults((data ?? []) as unknown as PrePostResult[]);
        }
        setLoading(false);
      });
  }, [selectedModule, teacherId]);

  // ── Derive data rows ──
  const rows: StudentRow[] = students.map((s) => {
    const pre = allResults.find(
      (r) => r.student_id === s.id && r.test_type === "pre"
    );
    const post = allResults.find(
      (r) => r.student_id === s.id && r.test_type === "post"
    );
    return {
      student_id: s.id,
      student_name: s.full_name,
      pre_score: pre?.score ?? null,
      post_score: post?.score ?? null,
      pre_normalized: pre?.score_normalized ?? null,
      post_normalized: post?.score_normalized ?? null,
    };
  });

  // ── Statistics ──
  const studentsWithBoth = rows.filter(
    (r) => r.pre_normalized !== null && r.post_normalized !== null
  );
  const preAvg =
    studentsWithBoth.length > 0
      ? Math.round(
          studentsWithBoth.reduce((s, r) => s + (r.pre_normalized ?? 0), 0) /
            studentsWithBoth.length
        )
      : 0;
  const postAvg =
    studentsWithBoth.length > 0
      ? Math.round(
          studentsWithBoth.reduce((s, r) => s + (r.post_normalized ?? 0), 0) /
            studentsWithBoth.length
        )
      : 0;

  let meningkat = 0;
  let menurun = 0;
  let tetap = 0;
  let tuntasPre = 0;
  let tuntasPost = 0;
  let totalAdaPost = 0;

  for (const r of studentsWithBoth) {
    const diff = (r.post_normalized ?? 0) - (r.pre_normalized ?? 0);
    if (diff > 0) meningkat++;
    else if (diff < 0) menurun++;
    else tetap++;

    if ((r.pre_normalized ?? 0) >= 70) tuntasPre++;
    if ((r.post_normalized ?? 0) >= 70) {
      tuntasPost++;
      totalAdaPost++;
    }
  }
  totalAdaPost = studentsWithBoth.length; // all have post if in both

  // ── Chart data ──
  const chartData: ChartData[] = studentsWithBoth.map((r) => ({
    name: r.student_name.length > 12
      ? r.student_name.substring(0, 10) + "…"
      : r.student_name,
    Pre: r.pre_normalized ?? 0,
    Post: r.post_normalized ?? 0,
  }));

  // ── Selected module info ──
  const selectedTest = prePostTests.find((t) => t.moduleId === selectedModule);

  // ── Handlers ──
  const handleModuleChange = useCallback((value: string) => {
    setSelectedModule(value);
  }, []);

  if (!teacherId) return null;

  return (
    <section aria-label="Pre/Post Test" className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" aria-hidden="true" />
            Pre/Post Test
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Bandingkan hasil pre-test dan post-test siswa per modul.
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Select value={selectedModule} onValueChange={handleModuleChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih modul…" />
            </SelectTrigger>
            <SelectContent>
              {prePostTests.map((test) => (
                <SelectItem key={test.moduleId} value={test.moduleId}>
                  {test.moduleTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selectedModule && (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center gap-3">
            <BookOpen className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
            <p className="font-medium text-foreground">Pilih modul terlebih dahulu</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Pilih modul dari dropdown di atas untuk melihat perbandingan hasil
              pre-test dan post-test siswa.
            </p>
          </CardContent>
        </Card>
      )}

      {selectedModule && loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Memuat data…</p>
          </CardContent>
        </Card>
      )}

      {selectedModule && error && (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center gap-2">
            <p className="text-red-600 font-medium">Gagal memuat data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedModule("");
                setTimeout(() => setSelectedModule(selectedModule), 100);
              }}
            >
              Coba lagi
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedModule && !loading && !error && (
        <>
          {/* ── Statistik Ringkasan ── */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Rata-rata Pre-Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  {preAvg}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Rata-rata Post-Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground flex items-center gap-2">
                  {postAvg}%
                  {postAvg > preAvg && (
                    <TrendingUp className="h-5 w-5 text-green-500" aria-hidden="true" />
                  )}
                  {postAvg < preAvg && (
                    <TrendingDown className="h-5 w-5 text-red-500" aria-hidden="true" />
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Siswa Meningkat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600 flex items-center gap-2">
                  {meningkat}
                  <span className="text-sm font-normal text-muted-foreground">
                    / {studentsWithBoth.length}
                  </span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ketuntasan (Post)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  {totalAdaPost > 0
                    ? Math.round((tuntasPost / totalAdaPost) * 100)
                    : 0}
                  %
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {tuntasPost} dari {totalAdaPost} siswa (≥70)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* ── Statistik Detail ── */}
          <div className="flex flex-wrap gap-4">
            <Card className="flex-1 min-w-[200px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tren Nilai
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" aria-hidden="true" />
                  <span className="text-sm text-foreground">
                    Meningkat: <strong>{meningkat}</strong> siswa
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" aria-hidden="true" />
                  <span className="text-sm text-foreground">
                    Menurun: <strong>{menurun}</strong> siswa
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Minus className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm text-foreground">
                    Tetap: <strong>{tetap}</strong> siswa
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Grafik Perbandingan ── */}
          {chartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" aria-hidden="true" />
                  Grafik Perbandingan Pre vs Post
                </CardTitle>
                {selectedTest && (
                  <CardDescription>
                    Modul: {selectedTest.moduleTitle}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={Math.max(300, chartData.length * 40)}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
                    barGap={4}
                    barCategoryGap="20%"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        fontSize: "13px",
                      }}
                      formatter={(value: number | undefined) =>
                        value !== undefined ? `${value}%` : "-"
                      }
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                    />
                    <Bar
                      dataKey="Pre"
                      fill="#94a3b8"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={20}
                    />
                    <Bar
                      dataKey="Post"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* ── Tabel Perbandingan ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" aria-hidden="true" />
                Tabel Perbandingan Nilai
              </CardTitle>
              {selectedTest && (
                <CardDescription>
                  Modul: {selectedTest.moduleTitle} — Menampilkan {rows.length} siswa
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Nama Siswa</TableHead>
                      <TableHead className="text-center whitespace-nowrap">Pre-Test</TableHead>
                      <TableHead className="text-center whitespace-nowrap">Post-Test</TableHead>
                      <TableHead className="text-center whitespace-nowrap">Selisih</TableHead>
                      <TableHead className="text-center whitespace-nowrap">Kategori Pre</TableHead>
                      <TableHead className="text-center whitespace-nowrap">Kategori Post</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Belum ada data hasil test untuk modul ini.
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((row) => {
                        const diff =
                          row.post_normalized !== null && row.pre_normalized !== null
                            ? row.post_normalized - row.pre_normalized
                            : null;
                        return (
                          <TableRow key={row.student_id}>
                            <TableCell className="font-medium whitespace-nowrap">
                              {row.student_name}
                            </TableCell>
                            <TableCell className="text-center">
                              {row.pre_normalized !== null ? (
                                <span className="font-semibold">{row.pre_normalized}%</span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {row.post_normalized !== null ? (
                                <span className="font-semibold">{row.post_normalized}%</span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {diff !== null ? (
                                <span className={`inline-flex items-center gap-1 font-semibold ${diffColor(diff)}`}>
                                  {diffIcon(diff)}
                                  {diff > 0 ? "+" : ""}
                                  {diff}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {row.pre_normalized !== null ? (
                                <Badge
                                  variant="outline"
                                  className={`text-xs font-medium whitespace-nowrap ${categoryColor(getCategory(row.pre_normalized))}`}
                                >
                                  {getCategory(row.pre_normalized)}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {row.post_normalized !== null ? (
                                <Badge
                                  variant="outline"
                                  className={`text-xs font-medium whitespace-nowrap ${categoryColor(getCategory(row.post_normalized))}`}
                                >
                                  {getCategory(row.post_normalized)}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </section>
  );
}
