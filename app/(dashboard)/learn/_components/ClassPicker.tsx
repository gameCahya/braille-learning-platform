import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { School, ChevronRight } from "lucide-react";
import Link from "next/link";
import TutorialDriver from "@/components/tutorial/TutorialDriver";
import { learnSteps } from "@/lib/tutorial/steps";

interface ClassPickerProps {
  classrooms: {
    id: string;
    name: string;
    description: string | null;
    completedCount: number;
    totalModules: number;
  }[];
}

export default function ClassPicker({ classrooms }: ClassPickerProps) {
  return (
    <div className="space-y-6">
      <div id="class-picker-header">
        <h1 className="text-3xl font-bold tracking-tight">Pilih Kelas</h1>
        <p className="text-muted-foreground mt-1">
          Pilih kelas yang ingin Anda ajarkan hari ini
        </p>
      </div>

      {classrooms.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center space-y-2">
            <School className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="font-medium">Belum ada kelas</p>
            <p className="text-sm text-muted-foreground">
              Buat kelas terlebih dahulu di menu{" "}
              <Link href="/classrooms" className="text-primary underline">Kelas</Link>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div id="class-picker-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classrooms.map((cls) => (
            <Link key={cls.id} href={`/learn/kelas?classId=${cls.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <School className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <CardTitle className="text-base leading-tight">{cls.name}</CardTitle>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                  </div>
                  {cls.description && <CardDescription className="text-xs mt-1">{cls.description}</CardDescription>}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2">
                    <Badge className={
                      cls.completedCount === cls.totalModules
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : cls.completedCount > 0
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-muted text-muted-foreground"
                    }>
                      {cls.completedCount}/{cls.totalModules} modul selesai
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <TutorialDriver steps={learnSteps} storageKey="bralingo-tutorial-learn" />
    </div>
  );
}
