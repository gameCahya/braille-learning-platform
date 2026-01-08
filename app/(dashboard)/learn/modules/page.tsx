"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle2, Lock, Clock } from "lucide-react";
import Link from "next/link";
import { MODULES } from "@/lib/data/modules";
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
          const progressMap: Record<string, UserProgress> = {};
          data.forEach((p) => {
            progressMap[p.module_id] = p;
          });
          setProgress(progressMap);
        }
      }
      setLoading(false);
    }

    loadProgress();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300";
    }
  };

  const isModuleUnlocked = (orderNumber: number) => {
    if (orderNumber === 1) return true;
    
    const previousModule = MODULES.find((m) => m.orderNumber === orderNumber - 1);
    if (!previousModule) return false;
    
    return progress[previousModule.id]?.completed || false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learning Modules</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Complete modules in order to unlock the next level
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-2xl font-bold">
                {Object.values(progress).filter((p) => p.completed).length} / {MODULES.length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Modules completed
              </div>
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold">
                {Math.round(
                  (Object.values(progress).filter((p) => p.completed).length / MODULES.length) * 100
                )}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Overall progress
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules List */}
      <div className="grid gap-6">
        {MODULES.map((module) => {
          const moduleProgress = progress[module.id];
          const isUnlocked = isModuleUnlocked(module.orderNumber);
          const isCompleted = moduleProgress?.completed || false;

          return (
            <Card
              key={module.id}
              className={`transition-all ${
                !isUnlocked ? "opacity-60" : "hover:shadow-lg"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold">
                        {module.orderNumber}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{module.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getDifficultyColor(module.difficulty)}>
                            {module.difficulty}
                          </Badge>
                          {isCompleted && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                          {!isUnlocked && (
                            <Badge variant="outline">
                              <Lock className="w-3 h-3 mr-1" />
                              Locked
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      {module.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{module.content.lessons.length} lessons</span>
                    </div>
                    {moduleProgress && !isCompleted && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>In progress</span>
                      </div>
                    )}
                  </div>
                  <Button
                    asChild={isUnlocked}
                    disabled={!isUnlocked || loading}
                  >
                    {isUnlocked ? (
                      <Link href={`/learn/modules/${module.id}`}>
                        {isCompleted ? "Review" : "Start Learning"}
                      </Link>
                    ) : (
                      <span>Locked</span>
                    )}
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