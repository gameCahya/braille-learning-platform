import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle2, Clock, School, GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getModulesByGrade, getGradeInfo, type Grade } from "@/lib/data/modules";
import { getModuleUUID } from "@/lib/data/moduleMapping";

interface Props {
  grade: Grade;
  searchParams: Promise<{ classId?: string }>;
}

export default async function GradeModuleList({ grade, searchParams }: Props) {
  const { classId } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const gradeInfo = getGradeInfo(grade);
  const modules = getModulesByGrade(grade);

  let className: string | null = null;
  let classProgressMap: Record<string, string> = {};

  if (classId) {
    const { data: cls } = await supabase
      .from("classrooms").select("name").eq("id", classId).eq("teacher_id", user!.id).single();
    className = cls?.name ?? null;

    const { data: progressData } = await supabase
      .from("class_progress").select("module_id, status").eq("classroom_id", classId);

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
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"><CheckCircle2 className="w-3 h-3 mr-1" />Selesai</Badge>;
    if (status === "in_progress")
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"><Clock className="w-3 h-3 mr-1" />Sedang Diajarkan</Badge>;
    return null;
  };

  const moduleHref = (moduleId: string) =>
    classId ? `/learn/kelas-${grade}/${moduleId}?classId=${classId}` : `/learn/kelas-${grade}/${moduleId}`;

  return (
    <div className="space-y-6">
      <div id="modules-header">
        <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2">
          <Link href={classId ? `/learn/kelas?classId=${classId}` : "/learn"}>
            <ArrowLeft className="h-4 w-4 mr-1" />Pilih Kelas
          </Link>
        </Button>

        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">{gradeInfo.label}</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              {gradeInfo.description}
              {className && <span className="font-semibold text-foreground"> — {className}</span>}
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

      {classId && (
        <Card id="modules-progress">
          <CardContent className="pt-5">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-2xl font-bold">{completedCount} / {modules.length}</p>
                <p className="text-sm text-muted-foreground">Modul selesai diajarkan</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0}%</p>
                <p className="text-sm text-muted-foreground">Progress kelas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div id="modules-list" className="grid gap-4">
        {modules.map((mod) => {
          const moduleUUID = getModuleUUID(mod.id);
          return (
            <Card key={mod.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold shrink-0">
                      {mod.order_number}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{mod.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge className={difficultyColor(mod.difficulty)}>{mod.difficulty}</Badge>
                        {classId && statusBadge(moduleUUID)}
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">{mod.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span>{mod.content.lessons.length} pelajaran</span>
                    {mod.content.exercises && mod.content.exercises.length > 0 && (
                      <span className="ml-2">| {mod.content.exercises.length} soal quiz</span>
                    )}
                  </div>
                  <Button asChild size="sm">
                    <Link href={moduleHref(mod.id)}>
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
