"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import type { Lesson } from "@/types";

interface Props {
  lessons: Lesson[];
}

export default function PhaseMembaca({ lessons }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-green-600" />
          <CardTitle>Fase Membaca</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Kosakata dan gambar untuk dibaca bersama siswa di kelas
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="rounded-xl border bg-card overflow-hidden shadow-sm"
            >
              {/* Gambar atau header warna */}
              {lesson.image ? (
                <div className="relative h-40 w-full bg-muted overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={lesson.image}
                    alt={lesson.imageAlt || lesson.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-28 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 flex items-center justify-center border-b">
                  <span className="text-4xl font-bold text-green-700 dark:text-green-300 tracking-widest">
                    {lesson.title}
                  </span>
                </div>
              )}

              {/* Konten */}
              <div className="p-4 space-y-2">
                <p className="font-semibold text-lg leading-tight">{lesson.title}</p>
                {lesson.content && (
                  <p className="text-sm text-muted-foreground">{lesson.content}</p>
                )}
                {lesson.example && (
                  <p className="text-xs text-muted-foreground italic border-t pt-2 mt-2">
                    {lesson.example}
                  </p>
                )}
                {lesson.braille && (
                  <p className="text-2xl font-mono tracking-widest text-blue-600 dark:text-blue-400 mt-1">
                    {lesson.braille}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
