"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface ReadAloudButtonProps {
  items: string[];
  label?: string;
}

/**
 * Tombol "Dengarkan Semua" — membacakan daftar item satu per satu
 * menggunakan Web Speech API dengan jeda antar item.
 */
export function ReadAloudButton({ items, label = "Dengarkan Semua" }: ReadAloudButtonProps) {
  const [isReading, setIsReading] = useState(false);
  const abortRef = useRef(false);

  const getBestVoice = (): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang.startsWith("id") && v.name.includes("Google")) ??
      voices.find((v) => v.lang.startsWith("id")) ??
      voices.find((v) => v.lang.startsWith("en") && v.name.includes("Google")) ??
      voices.find((v) => v.lang.startsWith("en")) ??
      null
    );
  };

  const speakItem = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (abortRef.current) {
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID";
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      const voice = getBestVoice();
      if (voice) utterance.voice = voice;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  const handleReadAll = async () => {
    if (isReading) {
      // Stop
      abortRef.current = true;
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    setIsReading(true);
    abortRef.current = false;

    // Chrome bug workaround
    window.speechSynthesis.cancel();
    await new Promise((r) => setTimeout(r, 150));

    for (const item of items) {
      if (abortRef.current) break;
      await speakItem(item);
      // Jeda antar item
      await new Promise((r) => setTimeout(r, 300));
    }

    setIsReading(false);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleReadAll}
      aria-label={isReading ? "Hentikan bacaan" : label}
    >
      {isReading ? (
        <VolumeX className="h-4 w-4 mr-2" aria-hidden="true" />
      ) : (
        <Volume2 className="h-4 w-4 mr-2" aria-hidden="true" />
      )}
      {isReading ? "Berhenti" : label}
    </Button>
  );
}
