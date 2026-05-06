import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, TrendingUp } from "lucide-react";
import TutorialDriver from "@/components/tutorial/TutorialDriver";
import { dashboardTutorialSteps } from "@/lib/tutorial/steps";
import Link from "next/link";

export default async function LearnPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  const { data: progressData } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user!.id);

  const completedModules = progressData?.filter((p) => p.completed).length || 0;
  const totalModules = 10;
  const progressPercentage = Math.round((completedModules / totalModules) * 100);
  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="space-y-6">
      <TutorialDriver
        steps={dashboardTutorialSteps}
        storageKey="dashboard-tutorial-seen"
        autoStart={true}
        showButton={true}
      />

      {/* ✅ id="welcome-message" */}
      <div id="welcome-message">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Continue your English learning journey with Braille
        </p>
      </div>

      {/* ✅ id="progress-overview" */}
      <Card id="progress-overview">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            You&apos;ve completed {completedModules} out of {totalModules} modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="text-slate-600 dark:text-slate-400">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progress: ${progressPercentage}%`}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ✅ id="quick-actions" */}
      <div id="quick-actions">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">Continue Learning</CardTitle>
              <CardDescription>Resume your current module</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/learn/modules">Start Learning</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <FileText className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">Practice</CardTitle>
              <CardDescription>Test your knowledge</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/practice">Practice Now</Link>
              </Button>
            </CardContent>
          </Card>

<Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle className="text-lg">Track Progress</CardTitle>
              <CardDescription>View your statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/progress">View Stats</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your learning history</CardDescription>
        </CardHeader>
        <CardContent>
          {completedModules === 0 ? (
            <div className="text-center py-8 text-slate-600 dark:text-slate-400">
              <p>No activity yet. Start learning to see your progress here!</p>
              <Button asChild className="mt-4">
                <Link href="/learn/modules">Get Started</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                You&apos;ve completed {completedModules} module{completedModules > 1 ? "s" : ""}. 
                Keep up the great work! 🎉
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
