"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import type { Lesson } from "@/types";
import { getBrailleDots, formatDotDescription, brailleStringToDescription } from "@/lib/braille";

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
      <CardContent className="space-y-8">
        {lessons.map((lesson) => (
          <div key={lesson.id}>
            <h3 className="font-semibold text-base mb-3 text-muted-foreground uppercase tracking-wide">
              {lesson.title}
            </h3>

            {lesson.words && lesson.words.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {lesson.words.map((word) => (
                  <div
                    key={word.id}
                    className="rounded-xl border bg-card overflow-hidden shadow-sm flex flex-col"
                  >
                    {word.image ? (
                      <div className="h-24 w-full bg-muted overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={word.image}
                          alt={word.imageAlt || word.indonesian}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-24 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 flex items-center justify-center border-b">
                        <span className="text-3xl">🐾</span>
                      </div>
                    )}
                    <div className="p-3 flex flex-col gap-1">
                      <p className="font-bold text-base leading-tight">{word.indonesian}</p>
                      <p className="text-xs text-muted-foreground">{word.english}</p>
                      <p className="text-lg font-mono tracking-widest text-blue-600 dark:text-blue-400" aria-label={`Braille untuk "${word.indonesian}": ${word.braille ? brailleStringToDescription(word.braille) : ""}`}>
                        {word.braille}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
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
                <div className="p-4 space-y-2">
                  {lesson.content && (
                    <p className="text-sm text-muted-foreground">{lesson.content}</p>
                  )}
                  {lesson.example && (
                    <p className="text-xs text-muted-foreground italic border-t pt-2 mt-2">
                      {lesson.example}
                    </p>
                  )}
                  {lesson.braille && (
                    <p
                      className="text-2xl font-mono tracking-widest text-blue-600 dark:text-blue-400 mt-1"
                      aria-label={`Braille: ${brailleStringToDescription(lesson.braille)}`}
                    >
                      {lesson.braille}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
