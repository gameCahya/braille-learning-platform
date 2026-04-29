import { createClient } from "@/lib/supabase/server";
import { quizzes } from "@/lib/data/quiz";
import {
  Users,
  School,
  ClipboardList,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default async function ReportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: classrooms } = await supabase
    .from("classrooms")
    .select("id, name")
    .eq("teacher_id", user!.id);

  const classroomIds = classrooms?.map((c) => c.id) ?? [];

  const { data: students } = await supabase
    .from("students")
    .select("id, full_name, classroom_id")
    .in("classroom_id", classroomIds.length > 0 ? classroomIds : ["__none__"]);

  const studentsByClass = (classrooms ?? []).map((cls) => ({
    ...cls,
    count: students?.filter((s) => s.classroom_id === cls.id).length ?? 0,
  }));

  const totalStudents = students?.length ?? 0;

  const stats = [
    { label: "Total Siswa", value: totalStudents, icon: Users },
    { label: "Total Kelas", value: classrooms?.length ?? 0, icon: School },
    { label: "Quiz Tersedia", value: quizzes.length, icon: ClipboardList },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Laporan
        </h1>
        <p className="text-muted-foreground mt-1">
          Ringkasan kelas, siswa, dan quiz yang tersedia.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-card border rounded-2xl p-5 flex items-center gap-4"
          >
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Siswa per kelas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Siswa per Kelas
          </h2>
          <Link
            href="/classrooms"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            Kelola kelas
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {studentsByClass.length === 0 ? (
          <div className="bg-card border rounded-2xl p-10 flex flex-col items-center text-center gap-2">
            <School className="h-6 w-6 text-muted-foreground" />
            <p className="font-medium text-foreground">Belum ada kelas</p>
            <p className="text-sm text-muted-foreground">
              Buat kelas terlebih dahulu untuk melihat data siswa.
            </p>
            <Link
              href="/classrooms/new"
              className="mt-2 text-sm text-primary hover:underline"
            >
              Buat kelas baru
            </Link>
          </div>
        ) : (
          <div className="bg-card border rounded-2xl divide-y divide-border">
            {studentsByClass.map((cls) => (
              <Link
                key={cls.id}
                href={`/classrooms/${cls.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <School className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {cls.name}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {cls.count} siswa
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quiz tersedia */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Quiz Tersedia
          </h2>
          <Link
            href="/quiz"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            Lihat semua
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="bg-card border rounded-2xl divide-y divide-border">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/quiz/${quiz.id}`}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {quiz.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {quiz.topic} · {quiz.questions.length} soal
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Progres siswa — coming soon */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          Progres Siswa
        </h2>
        <div className="bg-card border rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-3">
          <div className="p-3 rounded-full bg-muted">
            <TrendingUp className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">Segera hadir</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Fitur tracking progres siswa per modul sedang dalam pengembangan.
          </p>
        </div>
      </div>
    </div>
  );
}
