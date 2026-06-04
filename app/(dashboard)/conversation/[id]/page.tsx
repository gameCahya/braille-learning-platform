"use client";

import { useState, useRef } from "react";
import { use } from "react";
import Link from "next/link";
import { ChevronLeft, Play, StopCircle, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { getConversationById } from "@/lib/data/conversations";

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

export default function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const conv = getConversationById(id);
  if (!conv) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/conversation" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Kembali ke daftar percakapan
      </Link>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">{conv.topic}</p>
        <h1 className="text-2xl font-bold text-foreground">{conv.title}</h1>
        <p className="text-muted-foreground mt-1">{conv.description}</p>
      </div>

      <ConversationPlayer conv={conv} />
    </div>
  );
}

function ConversationPlayer({ conv }: { conv: ReturnType<typeof getConversationById> }) {
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const abortRef = useRef(false);

  if (!conv) return null;

  const speakLine = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (abortRef.current) { resolve(); return; }
      window.speechSynthesis.cancel();
      setTimeout(() => {
        if (abortRef.current) { resolve(); return; }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        const voice = getBestVoice();
        if (voice) utterance.voice = voice;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      }, 100);
    });
  };

  const playLine = async (index: number) => {
    window.speechSynthesis.cancel();
    abortRef.current = true;
    await new Promise((r) => setTimeout(r, 150));
    abortRef.current = false;
    setCurrentLine(index);
    await speakLine(conv.lines[index].text);
    setCurrentLine(null);
  };

  const playAll = async () => {
    if (isPlayingAll) {
      abortRef.current = true;
      window.speechSynthesis.cancel();
      setIsPlayingAll(false);
      setCurrentLine(null);
      return;
    }

    setIsPlayingAll(true);
    abortRef.current = false;
    window.speechSynthesis.cancel();
    await new Promise((r) => setTimeout(r, 150));

    for (let i = 0; i < conv.lines.length; i++) {
      if (abortRef.current) break;
      setCurrentLine(i);
      // Announce speaker
      await speakLine(`${conv.lines[i].speaker} says:`);
      await new Promise((r) => setTimeout(r, 200));
      if (abortRef.current) break;
      await speakLine(conv.lines[i].text);
      await new Promise((r) => setTimeout(r, 500));
    }

    setIsPlayingAll(false);
    setCurrentLine(null);
  };

  const stopAll = () => {
    abortRef.current = true;
    window.speechSynthesis.cancel();
    setIsPlayingAll(false);
    setCurrentLine(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Script Percakapan</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={playAll}
              aria-label={isPlayingAll ? "Hentikan semua" : "Dengarkan semua percakapan"}
            >
              {isPlayingAll ? (
                <StopCircle className="h-4 w-4 mr-2" aria-hidden="true" />
              ) : (
                <Play className="h-4 w-4 mr-2" aria-hidden="true" />
              )}
              {isPlayingAll ? "Berhenti" : "Putar Semua"}
            </Button>
            {isPlayingAll && (
              <Button variant="ghost" size="sm" onClick={stopAll} aria-label="Hentikan">
                <StopCircle className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1" role="list" aria-label="Baris percakapan">
          {conv.lines.map((line, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                currentLine === i ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
              }`}
              role="listitem"
            >
              {/* Play button */}
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-9 w-9"
                onClick={() => playLine(i)}
                aria-label={`Dengarkan: ${line.speaker} says: ${line.text}`}
                disabled={isPlayingAll}
              >
                {currentLine === i ? (
                  <Volume2 className="h-4 w-4 text-primary animate-pulse" aria-hidden="true" />
                ) : (
                  <Play className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>

              {/* Script */}
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wide">{line.speaker}</p>
                <p className="text-base text-foreground leading-relaxed">{line.text}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
