"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Hash, Play, StopCircle, Volume2 } from "lucide-react";
import { songs, countingExercises } from "@/lib/data/entertain";

function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.startsWith("en") && v.name.includes("Google")) ??
    voices.find((v) => v.lang.startsWith("en") && v.name.includes("Microsoft")) ??
    voices.find((v) => v.lang.startsWith("en") && !v.localService) ??
    voices.find((v) => v.lang.startsWith("en")) ??
    null
  );
}

function speakText(text: string): Promise<void> {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    const voice = getBestVoice();
    if (voice) utterance.voice = voice;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

export default function EntertainPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Entertain</h1>
        <p className="text-muted-foreground mt-1">
          Lagu dan latihan berhitung Bahasa Inggris yang menyenangkan untuk siswa.
        </p>
      </div>

      {/* ============ Menyanyi ============ */}
      <section aria-label="Lagu">
        <div className="flex items-center gap-2 mb-4">
          <Music className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-bold text-foreground">Menyanyi</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>

      {/* ============ Berhitung ============ */}
      <section aria-label="Berhitung">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-bold text-foreground">Berhitung</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {countingExercises.map((ex) => (
            <CountingCard key={ex.id} exercise={ex} />
          ))}
        </div>
      </section>
    </div>
  );
}

function SongCard({ song }: { song: (typeof songs)[0] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const abortRef = useRef(false);

  const playSong = async () => {
    if (isPlaying) {
      abortRef.current = true;
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentLine(null);
      return;
    }

    setIsPlaying(true);
    abortRef.current = false;
    window.speechSynthesis.cancel();
    await new Promise((r) => setTimeout(r, 150));

    for (let i = 0; i < song.lyrics.length; i++) {
      if (abortRef.current) break;
      setCurrentLine(i);
      await speakText(song.lyrics[i]);
      await new Promise((r) => setTimeout(r, 400));
    }

    setIsPlaying(false);
    setCurrentLine(null);
  };

  const playLine = async (index: number) => {
    window.speechSynthesis.cancel();
    abortRef.current = true;
    await new Promise((r) => setTimeout(r, 150));
    abortRef.current = false;
    setCurrentLine(index);
    await speakText(song.lyrics[index]);
    setCurrentLine(null);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{song.title}</CardTitle>
            <CardDescription className="text-sm">{song.description}</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={playSong}
            aria-label={isPlaying ? "Hentikan lagu" : `Putar lagu ${song.title}`}
          >
            {isPlaying ? (
              <StopCircle className="h-4 w-4 mr-2" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4 mr-2" aria-hidden="true" />
            )}
            {isPlaying ? "Stop" : "Putar"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div role="list" aria-label={`Lirik lagu ${song.title}`}>
          {song.lyrics.map((line, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 py-1 px-2 rounded transition-colors ${
                currentLine === i ? "bg-primary/10" : ""
              }`}
              role="listitem"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => playLine(i)}
                aria-label={`Dengarkan baris: ${line}`}
                disabled={isPlaying}
              >
                {currentLine === i ? (
                  <Volume2 className="h-3.5 w-3.5 text-primary animate-pulse" aria-hidden="true" />
                ) : (
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </Button>
              <p className="text-base text-foreground leading-relaxed">{line}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CountingCard({ exercise }: { exercise: (typeof countingExercises)[0] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const abortRef = useRef(false);

  const playAll = async () => {
    if (isPlaying) {
      abortRef.current = true;
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentIndex(null);
      return;
    }

    setIsPlaying(true);
    abortRef.current = false;
    window.speechSynthesis.cancel();
    await new Promise((r) => setTimeout(r, 150));

    for (let i = 0; i < exercise.items.length; i++) {
      if (abortRef.current) break;
      setCurrentIndex(i);
      await speakText(exercise.items[i]);
      await new Promise((r) => setTimeout(r, 600));
    }

    setIsPlaying(false);
    setCurrentIndex(null);
  };

  const playItem = async (index: number) => {
    window.speechSynthesis.cancel();
    abortRef.current = true;
    await new Promise((r) => setTimeout(r, 150));
    abortRef.current = false;
    setCurrentIndex(index);
    await speakText(exercise.items[index]);
    setCurrentIndex(null);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{exercise.title}</CardTitle>
            <CardDescription className="text-sm">{exercise.description}</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={playAll}
            aria-label={isPlaying ? "Hentikan" : `Putar semua: ${exercise.title}`}
          >
            {isPlaying ? (
              <StopCircle className="h-4 w-4 mr-2" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4 mr-2" aria-hidden="true" />
            )}
            {isPlaying ? "Stop" : "Putar"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div role="list" aria-label={exercise.title}>
          {exercise.items.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 py-1.5 px-2 rounded transition-colors ${
                currentIndex === i ? "bg-primary/10" : ""
              }`}
              role="listitem"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => playItem(i)}
                aria-label={`Dengarkan: ${item}`}
                disabled={isPlaying}
              >
                {currentIndex === i ? (
                  <Volume2 className="h-3.5 w-3.5 text-primary animate-pulse" aria-hidden="true" />
                ) : (
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </Button>
              <p className="text-base text-foreground leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
