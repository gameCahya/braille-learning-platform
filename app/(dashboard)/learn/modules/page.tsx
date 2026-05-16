import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle2, Clock, School, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MODULES } from "@/lib/data/modules";
import { getModuleUUID } from "@/lib/data/moduleMapping";

interface Props {
  searchParams: Promise<{ classId?: string }>;
}

export default async function ModulesPage({ searchParams }: Props) {
  const { classId } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Ambil nama kelas jika classId ada
  let className: string | null = null;
  let classProgressMap: Record<string, string> = {};

  if (classId) {
    const { data: cls } = await supabase
      .from("classrooms")
      .select("name")
      .eq("id", classId)
      .eq("teacher_id", user!.id)
      .single();

    className = cls?.name ?? null;

    const { data: progressData } = await supabase
      .from("class_progress")
      .select("module_id, status")
      .eq("classroom_id", classId);

    if (progressData) {
      progressData.forEach((p) => { classProgressMap[p.module_id] = p.status; });
    }
  }

  const completedCount = Object.values(classProgressMap).filter((s) => s === "completed").length;

  const difficultyColor = (d: string) =>
    d === "beginner"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : d === "intermediate"
      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";

  const statusBadge = (moduleUUID: string) => {
    const status = classProgressMap[moduleUUID];
    if (status === "completed")
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"><CheckCircle2 className="w-3 h-3 mr-1" />Selesai Diajarkan</Badge>;
    if (status === "in_progress")
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"><Clock className="w-3 h-3 mr-1" />Sedang Diajarkan</Badge>;
    return null;
  };

  const moduleHref = (moduleId: string) =>
    classId ? `/learn/modules/${moduleId}?classId=${classId}` : `/learn/modules/${moduleId}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2">
          <Link href="/learn">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Pilih Kelas
          </Link>
        </Button>

        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Modul Belajar</h1>
            <p className="text-muted-foreground mt-1">
              {className
                ? `Mengajar untuk kelas: `
                : "Semua modul tersedia — pilih kelas untuk lacak progress"}
              {className && <span className="font-semibold text-foreground">{className}</span>}
            </p>
          </div>
          {className && (
            <Badge variant="outline" className="flex items-center gap-1.5 text-sm px-3 py-1.5">
              <School className="h-4 w-4" />
              {className}
            </Badge>
          )}
        </div>
      </div>

      {/* Ringkasan progress */}
      {classId && (
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-2xl font-bold">{completedCount} / {MODULES.length}</p>
                <p className="text-sm text-muted-foreground">Modul selesai diajarkan</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round((completedCount / MODULES.length) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">Progress kelas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daftar modul */}
      <div className="grid gap-4">
        {MODULES.map((module) => {
          const moduleUUID = getModuleUUID(module.id);
          return (
            <Card key={module.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold shrink-0">
                      {module.order_number}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge className={difficultyColor(module.difficulty)}>
                          {module.difficulty}
                        </Badge>
                        {classId && statusBadge(moduleUUID)}
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2 ml-13">{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span>{module.content.lessons.length} pelajaran</span>
                  </div>
                  <Button asChild size="sm">
                    <Link href={moduleHref(module.id)}>
                      {classProgressMap[moduleUUID] === "completed" ? "Ulangi" : "Buka"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
