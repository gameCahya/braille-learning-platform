import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import TutorialDriver from "@/components/tutorial/TutorialDriver";
import { learnSteps } from "@/lib/tutorial/steps";
import { ALL_MODULES } from "@/lib/data/modules";

interface Props {
  classId?: string;
  className?: string;
}

const GRADES = [
  { grade: 7, label: "Kelas 7", desc: "Materi dasar Bahasa Inggris untuk kelas 7 SMPLB", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950", border: "border-blue-200 dark:border-blue-800" },
  { grade: 8, label: "Kelas 8", desc: "Materi lanjutan untuk kelas 8 SMPLB", icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950", border: "border-purple-200 dark:border-purple-800" },
  { grade: 9, label: "Kelas 9", desc: "Materi penguatan untuk kelas 9 SMPLB", icon: GraduationCap, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950", border: "border-green-200 dark:border-green-800" },
];

export default function GradePicker({ classId, className }: Props) {
  const href = (g: number) => classId ? `/learn/kelas-${g}?classId=${classId}` : `/learn/kelas-${g}`;

  return (
    <div className="space-y-6">
      <div id="class-picker-header">
        {className && (
          <div className="flex items-center gap-2 mb-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/20 w-fit">
            <GraduationCap className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm font-medium">Kelas:</span>
            <span className="text-sm font-bold text-primary">{className}</span>
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight">Pilih Tingkat Kelas</h1>
        <p className="text-muted-foreground mt-1">
          Pilih tingkat kelas untuk melihat materi pembelajaran
        </p>
      </div>

      <div id="class-picker-grid" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {GRADES.map(({ grade, label, desc, icon: Icon, color, bg, border }) => {
          const count = ALL_MODULES.filter((m) => m.grade === grade).length;
          return (
            <Link key={grade} href={href(grade)}>
              <Card className={`hover:shadow-md transition-shadow cursor-pointer h-full border-2 ${border}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className={`p-2 rounded-lg ${bg}`}>
                      <Icon className={`h-6 w-6 ${color}`} />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                  </div>
                  <CardTitle className="text-lg mt-2">{label}</CardTitle>
                  <CardDescription className="text-xs">{desc}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Badge variant="outline">{count} modul</Badge>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <TutorialDriver steps={learnSteps} storageKey="bralingo-tutorial-kelas" />
    </div>
  );
}
