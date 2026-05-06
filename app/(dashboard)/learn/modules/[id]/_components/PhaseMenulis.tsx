"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import BrailleDisplay from "@/components/braille/BrailleDisplay";
import type { Lesson } from "@/types";

interface Props {
  lessons: Lesson[];
}

export default function PhaseMenulis({ lessons }: Props) {
  const [index, setIndex] = useState(0);
  const lesson = lessons[index];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Pencil className="h-5 w-5 text-blue-600" />
          <CardTitle>Fase Menulis</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Tampilkan ke siswa — minta siswa tulis pola Braille di kertas
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            {index + 1} / {lessons.length}
          </Badge>
          <p className="text-sm text-muted-foreground">{lesson.title}</p>
        </div>

        {/* Tampilan huruf/kata besar untuk kelas */}
        <div className="text-center py-10 bg-muted/30 rounded-xl border">
          <p className="text-7xl font-bold tracking-widest text-foreground">
            {lesson.title}
          </p>
          {lesson.content && (
            <p className="text-base text-muted-foreground mt-3 px-4">
              {lesson.content}
            </p>
          )}
        </div>

        {/* Pola Braille */}
        {lesson.braille && (
          <BrailleDisplay
            text={lesson.title}
            braille={lesson.braille}
            showText={false}
          />
        )}

        {lesson.example && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
              Contoh
            </p>
            <p className="text-sm">{lesson.example}</p>
          </div>
        )}

        {/* Navigasi */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setIndex((i) => i - 1)}
            disabled={index === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Sebelumnya
          </Button>
          <Button
            onClick={() => setIndex((i) => i + 1)}
            disabled={index === lessons.length - 1}
          >
            Berikutnya
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
