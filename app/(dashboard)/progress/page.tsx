"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Award, 
  Target, 
  BookOpen,
  CheckCircle2,
  Clock,
  Zap,
  Trophy
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { MODULES } from "@/lib/data/modules";
import type { UserProgress, QuizResult } from "@/types";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
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
        // Load progress
        const { data: progressData } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id);

        // Load quiz results
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
            <p className="text-slate-600 dark:text-slate-400">
              Loading your progress...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedModules = progress.filter((p) => p.completed);
  const totalModules = MODULES.length;
  const overallProgress = Math.round((completedModules.length / totalModules) * 100);
  const averageScore = completedModules.length > 0
    ? Math.round(
        completedModules.reduce((sum, p) => sum + (p.score || 0), 0) / completedModules.length
      )
    : 0;

  // Prepare chart data
  const moduleData = MODULES.map((module) => {
    const moduleProgress = progress.find((p) => p.module_id === module.id);
    return {
      name: `Module ${module.orderNumber}`,
      score: moduleProgress?.score || 0,
      completed: moduleProgress?.completed ? 1 : 0,
    };
  });

  const quizTrend = quizResults.slice(-5).map((quiz, index) => ({
    name: `Quiz ${index + 1}`,
    score: quiz.score,
  }));

  const difficultyData = MODULES.reduce((acc, module) => {
    const moduleProgress = progress.find((p) => p.module_id === module.id);
    if (moduleProgress?.completed) {
      const existing = acc.find((d) => d.name === module.difficulty);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: module.difficulty, value: 1 });
      }
    }
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  // Achievements
  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first module",
      icon: "🎯",
      earned: completedModules.length >= 1,
    },
    {
      id: 2,
      title: "Quick Learner",
      description: "Complete 3 modules",
      icon: "⚡",
      earned: completedModules.length >= 3,
    },
    {
      id: 3,
      title: "Perfect Score",
      description: "Get 100% on any quiz",
      icon: "💯",
      earned: quizResults.some((q) => q.score === 100),
    },
    {
      id: 4,
      title: "Dedicated Student",
      description: "Complete all modules",
      icon: "🏆",
      earned: completedModules.length === totalModules,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-blue-600" />
          Your Progress
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Modules Completed
            </CardDescription>
            <CardTitle className="text-3xl">
              {completedModules.length}/{totalModules}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Average Score
            </CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {averageScore}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Across {completedModules.length} modules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Quizzes Taken
            </CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {quizResults.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total quiz attempts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Achievements
            </CardDescription>
            <CardTitle className="text-3xl text-purple-600">
              {achievements.filter((a) => a.earned).length}/{achievements.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Badges earned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Module Scores</CardTitle>
            <CardDescription>Your performance across all modules</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={moduleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quiz Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Performance Trend</CardTitle>
            <CardDescription>Your recent quiz scores</CardDescription>
          </CardHeader>
          <CardContent>
            {quizTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={quizTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#10b981" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                <p>No quiz data yet. Complete some quizzes to see your trend!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Distribution */}
      {difficultyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Modules by Difficulty</CardTitle>
            <CardDescription>Distribution of completed modules</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Achievements
          </CardTitle>
          <CardDescription>Your learning milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.earned
                    ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-950"
                    : "border-slate-200 dark:border-slate-700 opacity-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      {achievement.earned && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {achievement.description}
                    </p>
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
          <CardTitle>Module Details</CardTitle>
          <CardDescription>Your progress in each module</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MODULES.map((module) => {
              const moduleProgress = progress.find((p) => p.module_id === module.id);
              const isCompleted = moduleProgress?.completed || false;
              const score = moduleProgress?.score || 0;

              return (
                <div
                  key={module.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold">
                      {module.orderNumber}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{module.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={
                            module.difficulty === "beginner"
                              ? "border-green-500 text-green-700"
                              : module.difficulty === "intermediate"
                              ? "border-yellow-500 text-yellow-700"
                              : "border-red-500 text-red-700"
                          }
                        >
                          {module.difficulty}
                        </Badge>
                        {isCompleted && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {isCompleted ? (
                      <>
                        <div className="text-2xl font-bold text-green-600">
                          {score}%
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Score
                        </p>
                      </>
                    ) : (
                      <Badge variant="outline">Not Started</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      {completedModules.length === totalModules ? (
        <Card className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h2 className="text-2xl font-bold">Congratulations!</h2>
              <p className="text-slate-600 dark:text-slate-400">
                You&apos;ve completed all modules! You&apos;re now a Braille master. Keep practicing to
                maintain your skills!
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Zap className="h-8 w-8 text-orange-500" />
              <div>
                <h3 className="font-semibold">Keep Going!</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  You&apos;re {overallProgress}% of the way through. Complete{" "}
                  {totalModules - completedModules.length} more module
                  {totalModules - completedModules.length > 1 ? "s" : ""} to finish!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}