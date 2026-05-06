"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Headphones, Play, Square, Repeat } from "lucide-react";
import type { Lesson } from "@/types";

interface Props {
  lessons: Lesson[];
}

const REPEAT_OPTIONS = [1, 2, 3, 5, 10];

export default function PhaseMendengarkan({ lessons }: Props) {
  const [index, setIndex] = useState(0);
  const [repeatCount, setRepeatCount] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRepeat, setCurrentRepeat] = useState(0);
  const playingRef = useRef(false);

  const lesson = lessons[index];

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      playingRef.current = false;
    };
  }, []);

  useEffect(() => {
    stopSpeech();
  }, [index]);

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    playingRef.current = false;
    setIsPlaying(false);
    setCurrentRepeat(0);
  };

  const handlePlay = () => {
    if (isPlaying) {
      stopSpeech();
      return;
    }

    playingRef.current = true;
    setIsPlaying(true);
    setCurrentRepeat(0);

    const text = lesson.title;
    const total = repeatCount;
    let current = 0;

    const playNext = () => {
      if (!playingRef.current || current >= total) {
        setIsPlaying(false);
        setCurrentRepeat(0);
        playingRef.current = false;
        return;
      }

      current++;
      setCurrentRepeat(current);

      window.speechSynthesis.cancel();
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 0.8;
        utterance.onend = () => setTimeout(playNext, 600);
        window.speechSynthesis.speak(utterance);
      }, 100);
    };

    playNext();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Headphones className="h-5 w-5 text-purple-600" />
          <CardTitle>Fase Mendengarkan</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Putar audio untuk siswa — atur jumlah pengulangan sesuai kebutuhan kelas
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            {index + 1} / {lessons.length}
          </Badge>
          {isPlaying && (
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 animate-pulse">
              Memutar {currentRepeat}/{repeatCount}
            </Badge>
          )}
        </div>

        {/* Tampilan kata besar */}
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

        {/* Kontrol pengulangan */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 bg-muted rounded-lg p-2">
            <Repeat className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium mr-1">Ulangi:</span>
            {REPEAT_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => !isPlaying && setRepeatCount(n)}
                disabled={isPlaying}
                className={`
                  w-9 h-9 rounded-md text-sm font-semibold transition-colors
                  ${repeatCount === n
                    ? "bg-purple-600 text-white"
                    : "bg-background hover:bg-accent disabled:opacity-50"
                  }
                `}
              >
                {n}x
              </button>
            ))}
          </div>
        </div>

        {/* Tombol putar */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handlePlay}
            className={`w-44 ${isPlaying ? "bg-destructive hover:bg-destructive/90" : "bg-purple-600 hover:bg-purple-700"} text-white`}
          >
            {isPlaying ? (
              <>
                <Square className="h-5 w-5 mr-2 fill-current" />
                Berhenti
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2 fill-current" />
                Putar Audio
              </>
            )}
          </Button>
        </div>

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
