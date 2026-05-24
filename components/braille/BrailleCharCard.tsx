"use client";

import { Volume2 } from "lucide-react";

interface BrailleCharCardProps {
  char: string;
  braille: string;
  dots?: string;
  description?: string;
  name?: string;
  speakText?: string;
}

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

export default function BrailleCharCard({
  char,
  braille,
  dots,
  description,
  name,
  speakText,
}: BrailleCharCardProps) {
  const handleSpeak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    // Chrome bug: needs a short delay after cancel before speaking
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(speakText ?? char);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      const voice = getBestVoice();
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  return (
    <div className="bg-card border rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-primary transition-colors group">
      <div className="text-2xl font-bold text-foreground">{char}</div>
      <div className="text-5xl font-mono text-foreground leading-none py-1">
        {braille}
      </div>
      {name && (
        <div className="text-xs text-muted-foreground font-medium text-center">
          {name}
        </div>
      )}
      {(description || dots) && (
        <div className="text-xs text-muted-foreground text-center">
          {description ?? `Titik: ${dots}`}
        </div>
      )}
      <button
        onClick={handleSpeak}
        aria-label={`Dengarkan ${char}`}
        className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        <Volume2 className="h-3.5 w-3.5" />
        Dengarkan
      </button>
    </div>
  );
}
