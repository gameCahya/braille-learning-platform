"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp, Award, Target, BookOpen, CheckCircle2, Clock, Zap, Trophy,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ALL_MODULES } from "@/lib/data/modules";
import type { UserProgress, QuizResult } from "@/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function ProgressPage() {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: progressData } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id);

        const { data: quizData } = await supabase
          .from("quiz_results")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        setProgress(progressData || []);
        setQuizResults(quizData || []);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground" role="status">Memuat progres kamu...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const modules = ALL_MODULES.map((m, i) => ({ ...m, order_number: i + 1 }));
  const completedModules = progress.filter((p) => p.completed);
  const totalModules = modules.length;
  const overallProgress = Math.round((completedModules.length / totalModules) * 100);
  const averageScore = completedModules.length > 0
    ? Math.round(completedModules.reduce((sum, p) => sum + (p.score || 0), 0) / completedModules.length)
    : 0;

  const moduleData = modules.map((module) => {
    const mp = progress.find((p) => p.module_id === module.id);
    return { name: module.title.substring(0, 15), score: mp?.score || 0, completed: mp?.completed ? 1 : 0 };
  });

  const quizTrend = quizResults.slice(-5).map((q, i) => ({
    name: `Kuis ${i + 1}`, score: q.score,
  }));

  const difficultyData = modules.reduce((acc, module) => {
    const mp = progress.find((p) => p.module_id === module.id);
    if (mp?.completed) {
      const label = module.difficulty === "beginner" ? "Pemula" : module.difficulty === "intermediate" ? "Menengah" : "Lanjutan";
      const existing = acc.find((d) => d.name === label);
      if (existing) existing.value += 1;
      else acc.push({ name: label, value: 1 });
    }
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  const achievements = [
    { id: 1, title: "Langkah Awal", description: "Selesaikan modul pertama", icon: "🎯", earned: completedModules.length >= 1 },
    { id: 2, title: "Pembelajar Cepat", description: "Selesaikan 3 modul", icon: "⚡", earned: completedModules.length >= 3 },
    { id: 3, title: "Skor Sempurna", description: "Dapatkan 100% di kuis manapun", icon: "💯", earned: quizResults.some((q) => q.score === 100) },
    { id: 4, title: "Siswa Berdedikasi", description: "Selesaikan semua modul", icon: "🏆", earned: completedModules.length === totalModules },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-blue-600" aria-hidden="true" />
          Progres Kamu
        </h1>
        <p className="text-muted-foreground mt-2">
          Lacak perjalanan belajar dan pencapaianmu
        </p>
      </div>

      {/* Key Stats */}
      <section aria-label="Statistik utama" className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Modul Selesai
            </CardDescription>
            <CardTitle className="text-3xl" aria-label={`${completedModules.length} dari ${totalModules} modul selesai`}>
              {completedModules.length}/{totalModules}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-2" aria-label={`Progres keseluruhan: ${overallProgress} persen`} />
            <p className="text-xs text-muted-foreground mt-2 sr-only">{overallProgress}% selesai</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Target className="h-4 w-4" aria-hidden="true" />
              Skor Rata-rata
            </CardDescription>
            <CardTitle className="text-3xl text-green-600">{averageScore}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Dari {completedModules.length} modul</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Kuis Dikerjakan
            </CardDescription>
            <CardTitle className="text-3xl text-blue-600">{quizResults.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total percobaan kuis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Trophy className="h-4 w-4" aria-hidden="true" />
              Pencapaian
            </CardDescription>
            <CardTitle className="text-3xl text-purple-600">
              {achievements.filter((a) => a.earned).length}/{achievements.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Lencana diperoleh</p>
          </CardContent>
        </Card>
      </section>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Skor per Modul</CardTitle>
            <CardDescription>Performa kamu di setiap modul</CardDescription>
          </CardHeader>
          <CardContent>
            <div aria-hidden="true">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={moduleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="sr-only" role="list" aria-label="Daftar skor modul">
              {moduleData.map((m) => (
                <span key={m.name}>{m.name}: skor {m.score}. </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tren Skor Kuis</CardTitle>
            <CardDescription>Skor kuis terbaru kamu</CardDescription>
          </CardHeader>
          <CardContent>
            {quizTrend.length > 0 ? (
              <>
                <div aria-hidden="true">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={quizTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="sr-only" role="list" aria-label="Tren skor kuis">
                  {quizTrend.map((q) => (
                    <span key={q.name}>{q.name}: skor {q.score}. </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>Belum ada data kuis. Kerjakan kuis untuk melihat tren!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Distribution */}
      {difficultyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Modul Selesai per Tingkat</CardTitle>
            <CardDescription>Distribusi modul yang sudah diselesaikan</CardDescription>
          </CardHeader>
          <CardContent>
            <div aria-hidden="true">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={difficultyData} cx="50%" cy="50%" labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                    {difficultyData.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="sr-only" role="list" aria-label="Distribusi tingkat kesulitan">
              {difficultyData.map((d) => (
                <span key={d.name}>Tingkat {d.name}: {d.value} modul. </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" aria-hidden="true" />
            Pencapaian
          </CardTitle>
          <CardDescription>Milestone pembelajaran kamu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label="Daftar pencapaian">
            {achievements.map((a) => (
              <div key={a.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  a.earned ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-950" : "border-border opacity-50"
                }`}
                role="listitem"
                aria-label={`${a.title}: ${a.earned ? "Diperoleh" : "Belum diperoleh"}. ${a.description}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl" aria-hidden="true">{a.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{a.title}</h3>
                      {a.earned && <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{a.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Module Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Modul</CardTitle>
          <CardDescription>Progres kamu di setiap modul</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3" role="list" aria-label="Daftar modul">
            {modules.map((module) => {
              const mp = progress.find((p) => p.module_id === module.id);
              const isCompleted = mp?.completed || false;
              const score = mp?.score || 0;
              const diffLabel = module.difficulty === "beginner" ? "Pemula" : module.difficulty === "intermediate" ? "Menengah" : "Lanjutan";

              return (
                <div key={module.id} className="flex items-center justify-between p-4 rounded-lg border" role="listitem"
                  aria-label={`${module.title}: ${isCompleted ? `Selesai, skor ${score}` : "Belum dimulai"}, tingkat ${diffLabel}`}>
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 font-bold" aria-hidden="true">
                      {module.order_number}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{module.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={module.difficulty === "beginner" ? "border-green-500 text-green-700" : module.difficulty === "intermediate" ? "border-yellow-500 text-yellow-700" : "border-red-500 text-red-700"}>
                          {diffLabel}
                        </Badge>
                        {isCompleted && <Badge className="bg-green-100 text-green-800">Selesai</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {isCompleted ? (
                      <>
                        <div className="text-2xl font-bold text-green-600">{score}%</div>
                        <p className="text-xs text-muted-foreground">Skor</p>
                      </>
                    ) : (
                      <Badge variant="outline">Belum Dimulai</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Motivational */}
      {completedModules.length === totalModules ? (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <span className="text-6xl" aria-hidden="true">🎉</span>
              <h2 className="text-2xl font-bold">Selamat!</h2>
              <p className="text-muted-foreground">
                Kamu sudah menyelesaikan semua modul! Kamu sekarang ahli Braille. Terus berlatih ya!
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Zap className="h-8 w-8 text-orange-500" aria-hidden="true" />
              <div>
                <h3 className="font-semibold">Terus Berjuang!</h3>
                <p className="text-sm text-muted-foreground">
                  Kamu sudah {overallProgress}% selesai. Tinggal {totalModules - completedModules.length} modul lagi!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
