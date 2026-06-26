import { createClient } from "@/lib/supabase/server";
import { quizzes } from "@/lib/data/quiz";
import { prePostTests } from "@/lib/data/pre-post-tests";
import {
  Users, School, ClipboardList, TrendingUp, ChevronRight, Award,
} from "lucide-react";
import Link from "next/link";
import { ReportExports } from "./_components/ReportExports";
import { PrePostTestSection } from "./_components/PrePostTestSection";

const DIFF_LABEL: Record<string, string> = {
  beginner: "Pemula",
  intermediate: "Menengah",
  advanced: "Lanjutan",
};

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isTeacher = profile?.role === "teacher";

  // --- Data untuk guru ---
  let classrooms: Array<{ id: string; name: string; count: number }> = [];
  let totalStudents = 0;
  let studentProgress: Array<{
    student_name: string;
    classroom_name: string;
    completed: number;
    total: number;
    avg_score: number;
  }> = [];
  let clsData: Array<{ id: string; name: string; students: Array<{ id: string; full_name: string }> }> | null = null;

  if (isTeacher) {
    const { data: fetchedCls } = await supabase
      .from("classrooms")
      .select("id, name, students(id, full_name)")
      .eq("teacher_id", user.id);

    clsData = fetchedCls;

    classrooms = (clsData ?? []).map((cls) => ({
      id: cls.id,
      name: cls.name,
      count: (cls.students ?? []).length,
    }));

    totalStudents = classrooms.reduce((sum, c) => sum + c.count, 0);

    // Progress siswa: fetch user_progress + quiz_results untuk semua siswa
    const allStudentIds: string[] = [];
    const studentMap: Record<string, { name: string; classroom: string }> = {};

    for (const cls of clsData ?? []) {
      for (const s of cls.students ?? []) {
        allStudentIds.push(s.id);
        studentMap[s.id] = { name: s.full_name, classroom: cls.name };
      }
    }

    if (allStudentIds.length > 0) {
      const { data: progressData } = await supabase
        .from("user_progress")
        .select("student_id, completed, score")
        .in("student_id", allStudentIds);

      const progressByStudent: Record<string, { completed: number; total: number; sumScore: number }> = {};
      for (const sid of allStudentIds) {
        progressByStudent[sid] = { completed: 0, total: 0, sumScore: 0 };
      }

      for (const p of progressData ?? []) {
        if (p.student_id && progressByStudent[p.student_id]) {
          progressByStudent[p.student_id].total += 1;
          if (p.completed) {
            progressByStudent[p.student_id].completed += 1;
            progressByStudent[p.student_id].sumScore += p.score || 0;
          }
        }
      }

      studentProgress = allStudentIds.map((sid) => {
        const p = progressByStudent[sid];
        const s = studentMap[sid];
        return {
          student_name: s?.name ?? "Tanpa Nama",
          classroom_name: s?.classroom ?? "-",
          completed: p.completed,
          total: p.total || 29, // total modul standar
          avg_score: p.completed > 0 ? Math.round(p.sumScore / p.completed) : 0,
        };
      });

      // Sort: by completion desc
      studentProgress.sort((a, b) => b.completed - a.completed);
    }
  }

  // Query juga teacher_quizzes count
  let teacherQuizCount = 0;
  if (isTeacher) {
    const { count } = await supabase
      .from("teacher_quizzes")
      .select("*", { count: "exact", head: true })
      .eq("teacher_id", user.id);
    teacherQuizCount = count ?? 0;
  }

  // Siapkan data siswa untuk PrePostTestSection
  const allStudents: Array<{ id: string; full_name: string }> = [];
  for (const cls of clsData ?? []) {
    for (const s of cls.students ?? []) {
      allStudents.push({ id: s.id, full_name: s.full_name });
    }
  }

  const totalQuizzes = quizzes.length + teacherQuizCount;

  const stats = [
    { label: "Total Siswa", value: totalStudents, icon: Users },
    { label: "Total Kelas", value: classrooms.length, icon: School },
    { label: "Quiz Tersedia", value: totalQuizzes, icon: ClipboardList },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Laporan</h1>
        <p className="text-muted-foreground mt-1">
          {isTeacher ? "Ringkasan kelas, siswa, progres, dan quiz." : "Ringkasan progres belajar kamu."}
        </p>
      </div>

      {/* Stats */}
      <section aria-label="Statistik ringkasan" className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card border rounded-2xl p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-primary/10" aria-hidden="true">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ============ GURU: Progres Siswa ============ */}
      {isTeacher && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Progres Siswa</h2>
            <div className="flex items-center gap-2">
              <ReportExports studentProgress={studentProgress} />
              <Link href="/progress" className="text-sm text-primary hover:underline flex items-center gap-1">
                Lihat detail <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {studentProgress.length === 0 ? (
            <div className="bg-card border rounded-2xl p-10 flex flex-col items-center text-center gap-2">
              <TrendingUp className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              <p className="font-medium text-foreground">Belum ada data progres</p>
              <p className="text-sm text-muted-foreground">
                Tambah siswa dan minta mereka mengerjakan modul untuk melihat progres.
              </p>
              <Link href="/students/new" className="mt-2 text-sm text-primary hover:underline">
                Tambah siswa baru
              </Link>
            </div>
          ) : (
            <div className="bg-card border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" aria-label="Tabel progres siswa">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left px-5 py-3 text-sm font-semibold text-foreground">Nama Siswa</th>
                      <th className="text-left px-5 py-3 text-sm font-semibold text-foreground">Kelas</th>
                      <th className="text-center px-5 py-3 text-sm font-semibold text-foreground">Modul Selesai</th>
                      <th className="text-center px-5 py-3 text-sm font-semibold text-foreground">Skor Rata-rata</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {studentProgress.slice(0, 20).map((sp) => (
                      <tr key={sp.student_name + sp.classroom_name} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3 text-sm font-medium text-foreground">{sp.student_name}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">{sp.classroom_name}</td>
                        <td className="px-5 py-3 text-center">
                          <span className="text-sm font-semibold text-foreground">{sp.completed}</span>
                          <span className="text-xs text-muted-foreground"> / {sp.total}</span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          {sp.completed > 0 ? (
                            <span className={`text-sm font-semibold ${sp.avg_score >= 70 ? "text-green-600" : sp.avg_score >= 40 ? "text-amber-600" : "text-red-600"}`}>
                              {sp.avg_score}%
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Siswa per kelas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Siswa per Kelas</h2>
          {isTeacher && (
            <Link href="/classrooms" className="text-sm text-primary hover:underline flex items-center gap-1">
              Kelola kelas <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>

        {classrooms.length === 0 ? (
          <div className="bg-card border rounded-2xl p-10 flex flex-col items-center text-center gap-2">
            <School className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            <p className="font-medium text-foreground">Belum ada kelas</p>
            <p className="text-sm text-muted-foreground">Buat kelas terlebih dahulu untuk melihat data siswa.</p>
            {isTeacher && (
              <Link href="/classrooms/new" className="mt-2 text-sm text-primary hover:underline">
                Buat kelas baru
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-card border rounded-2xl divide-y divide-border">
            {classrooms.map((cls) => (
              <Link key={cls.id} href={`/classrooms/${cls.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-primary/10" aria-hidden="true">
                    <School className="h-4 w-4 text-primary" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium text-foreground">{cls.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{cls.count} siswa</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quiz tersedia */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Quiz Tersedia</h2>
          <Link href="/quiz" className="text-sm text-primary hover:underline flex items-center gap-1">
            Lihat semua <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        <div className="bg-card border rounded-2xl divide-y divide-border">
          {quizzes.map((quiz) => (
            <Link key={quiz.id} href={`/quiz/${quiz.id}`}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
              <div>
                <p className="text-sm font-medium text-foreground">{quiz.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{quiz.topic} · {quiz.questions.length} soal</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>

      {/* ============ GURU: Pre/Post Test ============ */}
      {isTeacher && (
        <PrePostTestSection
          prePostTests={prePostTests}
          initialStudents={allStudents}
          teacherId={user.id}
        />
      )}
    </div>
  );
}
