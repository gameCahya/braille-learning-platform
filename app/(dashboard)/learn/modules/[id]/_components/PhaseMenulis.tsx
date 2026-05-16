"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import BrailleDisplay from "@/components/braille/BrailleDisplay";
import type { Lesson, VocabularyWord } from "@/types";

interface Props {
  lessons: Lesson[];
}

type WordEntry = VocabularyWord & { lessonTitle: string };

export default function PhaseMenulis({ lessons }: Props) {
  const [index, setIndex] = useState(0);

  const allWords = useMemo<WordEntry[]>(() => {
    const words: WordEntry[] = [];
    for (const lesson of lessons) {
      if (lesson.words && lesson.words.length > 0) {
        for (const w of lesson.words) {
          words.push({ ...w, lessonTitle: lesson.title });
        }
      }
    }
    return words;
  }, [lessons]);

  const hasWords = allWords.length > 0;

  if (hasWords) {
    const word = allWords[index];
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
              {index + 1} / {allWords.length}
            </Badge>
            <p className="text-sm text-muted-foreground">{word.lessonTitle}</p>
          </div>

          <div className="text-center py-10 bg-muted/30 rounded-xl border space-y-2">
            {word.image && (
              <div className="flex justify-center mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={word.image}
                  alt={word.imageAlt || word.indonesian}
                  className="h-28 w-28 object-cover rounded-xl border"
                />
              </div>
            )}
            <p className="text-7xl font-bold tracking-widest text-foreground">
              {word.indonesian}
            </p>
            <p className="text-2xl text-muted-foreground">{word.english}</p>
          </div>

          <BrailleDisplay
            text={word.indonesian}
            braille={word.braille}
            showText={false}
          />

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIndex((i) => i - 1)} disabled={index === 0}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Sebelumnya
            </Button>
            <Button onClick={() => setIndex((i) => i + 1)} disabled={index === allWords.length - 1}>
              Berikutnya
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Fallback: lesson tanpa words (misal modul alfabet, angka)
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

        {lesson.braille && (
          <BrailleDisplay text={lesson.title} braille={lesson.braille} showText={false} />
        )}

        {lesson.example && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Contoh</p>
            <p className="text-sm">{lesson.example}</p>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setIndex((i) => i - 1)} disabled={index === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Sebelumnya
          </Button>
          <Button onClick={() => setIndex((i) => i + 1)} disabled={index === lessons.length - 1}>
            Berikutnya
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
