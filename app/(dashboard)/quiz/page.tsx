import Link from "next/link";
import { quizzes, quizTopics } from "@/lib/data/quiz";
import { ClipboardList, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuizPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Quiz & Test</h1>
        <p className="text-muted-foreground mt-1">
          Pilih quiz untuk ditampilkan kepada siswa di kelas.
        </p>
      </div>

      {quizTopics.map((topic) => (
        <div key={topic} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {topic}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes
              .filter((q) => q.topic === topic)
              .map((quiz) => (
                <Link key={quiz.id} href={`/quiz/${quiz.id}`}>
                  <Card className="hover:border-primary hover:shadow-sm transition-all cursor-pointer h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <ClipboardList className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      </div>
                      <CardTitle className="text-base">{quiz.title}</CardTitle>
                      <CardDescription className="text-sm">{quiz.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        {quiz.questions.length} soal
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
