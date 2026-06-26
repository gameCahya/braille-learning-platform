"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  ClipboardCheck,
  Eye,
  AlertCircle,
  Users,
  BookOpenCheck,
  ChevronRight,
} from "lucide-react";
import { prePostTests } from "@/lib/data/pre-post-tests";
import type { PrePostTestData } from "@/types";

// ──────────────────────────────────────────
// Types
// ──────────────────────────────────────────

interface Student {
  id: string;
  full_name: string;
}

interface PrePostResult {
  module_id: string;
  test_type: "pre" | "post";
  score: number;
  score_normalized: number;
  status: "completed" | "pending_review";
}

interface ModuleStatus {
  moduleId: string;
  moduleTitle: string;
  pre: PrePostResult | null;
  post: PrePostResult | null;
}

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────

function getScoreColor(score: number): string {
  if (score >= 75) return "text-green-600 dark:text-green-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getScoreBadgeVariant(
  exists: boolean,
  score?: number
): "default" | "secondary" | "outline" | "destructive" {
  if (!exists) return "outline";
  if (!score) return "secondary";
  if (score >= 75) return "default";
  if (score >= 50) return "secondary";
  return "destructive";
}

function getActionButton(
  status: ModuleStatus
): { label: string; href: string; variant: "default" | "secondary" | "outline" } {
  if (!status.pre) {
    return { label: "Kerjakan Pre-Test", href: `/prepost-test/${status.moduleId}/pre`, variant: "default" };
  }
  if (!status.post) {
    return { label: "Kerjakan Post-Test", href: `/prepost-test/${status.moduleId}/post`, variant: "secondary" };
  }
  return { label: "Lihat Hasil", href: `/prepost-test/${status.moduleId}/results`, variant: "outline" };
}

// ──────────────────────────────────────────
// Module Card Component
// ──────────────────────────────────────────

function ModuleCard({ status }: { status: ModuleStatus }) {
  const action = getActionButton(status);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">
            {status.moduleTitle}
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Modul: {status.moduleId.replace(/-/g, " ")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        {/* Status badges */}
        <div className="space-y-2 flex-1">
          {/* Pre-Test Status */}
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Pre-Test
            </span>
            {status.pre ? (
              <Badge
                variant={getScoreBadgeVariant(true, status.pre.score_normalized)}
                className={`text-xs ${getScoreColor(status.pre.score_normalized)}`}
              >
                {status.pre.score_normalized}/100
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                Belum
              </Badge>
            )}
          </div>

          {/* Post-Test Status */}
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <BookOpenCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Post-Test
            </span>
            {status.post ? (
              <Badge
                variant={getScoreBadgeVariant(true, status.post.score_normalized)}
                className={`text-xs ${getScoreColor(status.post.score_normalized)}`}
              >
                {status.post.score_normalized}/100
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                Belum
              </Badge>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant={action.variant}
          size="sm"
          className="w-full"
          asChild
        >
          <Link
            href={action.href}
            aria-label={
              action.label === "Kerjakan Pre-Test"
                ? `Kerjakan pre-test untuk modul ${status.moduleTitle}`
                : action.label === "Kerjakan Post-Test"
                  ? `Kerjakan post-test untuk modul ${status.moduleTitle}`
                  : `Lihat hasil test untuk modul ${status.moduleTitle}`
            }
          >
            {action.label === "Kerjakan Pre-Test" && (
              <FileText className="h-4 w-4 mr-1.5" aria-hidden="true" />
            )}
            {action.label === "Kerjakan Post-Test" && (
              <ClipboardCheck className="h-4 w-4 mr-1.5" aria-hidden="true" />
            )}
            {action.label === "Lihat Hasil" && (
              <Eye className="h-4 w-4 mr-1.5" aria-hidden="true" />
            )}
            {action.label}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// ──────────────────────────────────────────
// Skeleton Card
// ──────────────────────────────────────────

function SkeletonCard() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-3/4 mb-1" />
        <Skeleton className="h-3 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-9 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}

// ──────────────────────────────────────────
// Main Page Component
// ──────────────────────────────────────────

export default function PrePostTestListPage() {
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Students (for teacher)
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Results keyed by module_id
  const [results, setResults] = useState<PrePostResult[]>([]);
  const [gradeLevel, setGradeLevel] = useState<string | null>(null);
  const [gradeLoaded, setGradeLoaded] = useState(false);

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
        .select("role, grade_level")
        .eq("id", authUser.id)
        .single()
        .then(({ data: profile }) => {
          const role = profile?.role ?? "teacher";
          const grade = profile?.grade_level ?? null;
          setUser({ id: authUser.id, role, grade_level: grade } as any);
          setGradeLevel(grade);
          setGradeLoaded(true);

          if (role === "teacher") {
            // Guru: ambil daftar siswa
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
            // Siswa: cari record student mereka
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
    if (!selectedStudentId) return;

    const supabase = createClient();
    setLoading(true);

    supabase
      .from("pre_post_results" as any)
      .select("module_id, test_type, score, score_normalized, status")
      .eq("student_id", selectedStudentId)
      .in("test_type", ["pre", "post"])
      .then(({ data, error: fetchError }: { data: any; error: any }) => {
        if (fetchError) {
          setError(fetchError.message);
        } else {
          setResults((data ?? []) as unknown as PrePostResult[]);
        }
        setLoading(false);
      });
  }, [selectedStudentId]);

  // ── Handle student selection ──
  const handleStudentChange = useCallback(
    (value: string) => {
      setSelectedStudentId(value);
    },
    []
  );

  // ── Derive module statuses with grade filter ──
  const filteredTests = gradeLoaded && gradeLevel
    ? prePostTests.filter((t) => !t.gradeLevel || t.gradeLevel === gradeLevel)
    : prePostTests;

  const moduleStatuses: ModuleStatus[] = filteredTests.map(
    (test: PrePostTestData) => ({
      moduleId: test.moduleId,
      moduleTitle: test.moduleTitle,
      pre: results.find(
        (r) => r.module_id === test.moduleId && r.test_type === "pre"
      ) ?? null,
      post: results.find(
        (r) => r.module_id === test.moduleId && r.test_type === "post"
      ) ?? null,
    })
  );

  const selectedStudentName = students.find(
    (s) => s.id === selectedStudentId
  )?.full_name;

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileText className="h-7 w-7 text-primary" aria-hidden="true" />
              Pre & Post Test
            </h1>
            <p className="text-muted-foreground mt-1">
              Kerjakan pre-test sebelum belajar dan post-test setelah selesai untuk mengukur pemahaman.
            </p>
          </div>

          {/* Student selector (guru only) */}
          {user?.role === "teacher" && (
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <label htmlFor="student-select" className="text-sm font-medium text-foreground whitespace-nowrap sr-only">
                Pilih Siswa
              </label>
              <Select
                value={selectedStudentId ?? undefined}
                onValueChange={handleStudentChange}
              >
                <SelectTrigger id="student-select" className="w-[220px]" aria-label="Pilih siswa untuk melihat hasil pre/post test">
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

        {/* Selected student info for teacher */}
        {user?.role === "teacher" && selectedStudentName && (
          <p className="text-sm text-muted-foreground mt-2">
            Menampilkan hasil untuk: <span className="font-medium text-foreground">{selectedStudentName}</span>
          </p>
        )}
      </div>

      {/* Loading state — tunggu sampai grade level juga terload */}
      {(!gradeLoaded || loading) && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* No student selected (teacher hasn't picked one) */}
      {gradeLoaded && !loading && user?.role === "teacher" && !selectedStudentId && (
        <Card>
          <CardContent className="flex flex-col items-center py-16 gap-3">
            <Users className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <p className="text-lg font-medium text-foreground">
              Pilih siswa untuk melihat status pre/post test
            </p>
            <p className="text-sm text-muted-foreground">
              Gunakan dropdown di atas untuk memilih siswa.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Guru sudah pilih siswa, atau siswa — tapi grade belum diketahui */}
      {gradeLoaded && !gradeLevel && user?.role !== "teacher" && (
        <Card>
          <CardContent className="flex flex-col items-center py-16 gap-3">
            <AlertCircle className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <p className="text-lg font-medium text-foreground">
              Grade level tidak tersedia
            </p>
            <p className="text-sm text-muted-foreground">
              Hubungi guru untuk mengatur kelas kamu.
            </p>
          </CardContent>
        </Card>
      )}

      {/* No results / student hasn't done any tests */}
      {gradeLoaded && !loading && selectedStudentId && results.length === 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {moduleStatuses.map((status) => (
            <ModuleCard key={status.moduleId} status={status} />
          ))}
        </div>
      )}

      {/* Results grid */}
      {gradeLoaded && !loading && selectedStudentId && results.length > 0 && (
        <>
          {/* Summary stats */}
          <section aria-label="Ringkasan pengerjaan test">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {moduleStatuses.filter((m) => m.pre).length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Pre-Test Selesai</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {moduleStatuses.filter((m) => m.post).length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Post-Test Selesai</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {moduleStatuses.filter((m) => m.pre && !m.post).length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Perlu Post-Test</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {moduleStatuses.filter((m) => m.pre && m.post).length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Selesai Keduanya</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Module grid */}
          <section aria-label="Daftar modul pre dan post test">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {moduleStatuses.map((status) => (
                <ModuleCard key={status.moduleId} status={status} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
