import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ModulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learning Modules</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Start your English learning journey with these modules
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Learning modules will be available here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 dark:text-slate-400">
            We&apos;re preparing comprehensive learning modules for you. Check back soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}