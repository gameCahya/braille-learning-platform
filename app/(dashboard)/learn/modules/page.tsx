"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { MODULES } from "@/lib/data/modules";
import { getModuleUUID } from "@/lib/data/moduleMapping";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserProgress } from "@/types";

export default function ModulesPage() {
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id);

        if (data) {
          const map: Record<string, UserProgress> = {};
          data.forEach((p) => { map[p.module_id] = p; });
          setProgress(map);
        }
      }
      setLoading(false);
    }
    loadProgress();
  }, []);

  const completedCount = Object.values(progress).filter((p) => p.completed).length;

  const difficultyColor = (d: string) =>
    d === "beginner"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : d === "intermediate"
      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modul Belajar</h1>
        <p className="text-muted-foreground mt-1">
          Pilih modul yang ingin dipelajari — semua modul bisa dibuka langsung
        </p>
      </div>

      {/* Ringkasan progress */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-2xl font-bold">{completedCount} / {MODULES.length}</p>
              <p className="text-sm text-muted-foreground">Modul selesai</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {Math.round((completedCount / MODULES.length) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Progress keseluruhan</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daftar modul */}
      <div className="grid gap-4">
        {MODULES.map((module) => {
          const moduleUUID = getModuleUUID(module.id);
          const moduleProgress = progress[moduleUUID];
          const isCompleted = moduleProgress?.completed ?? false;

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
                        {isCompleted && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Selesai
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2 ml-13">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span>{module.content.lessons.length} pelajaran</span>
                  </div>
                  <Button asChild disabled={loading} size="sm">
                    <Link href={`/learn/modules/${module.id}`}>
                      {isCompleted ? "Ulangi" : "Pelajari"}
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
