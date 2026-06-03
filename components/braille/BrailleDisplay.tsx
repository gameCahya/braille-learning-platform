"use client";

import { Card } from "@/components/ui/card";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brailleStringToDescription } from "@/lib/braille";

interface BrailleDisplayProps {
  text: string;
  braille: string;
  showText?: boolean;
  onSpeak?: () => void;
}

export default function BrailleDisplay({
  text,
  braille,
  showText = true,
  onSpeak,
}: BrailleDisplayProps) {
  const dotDescription = braille ? brailleStringToDescription(braille) : "";

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Original Text */}
        {showText && text && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">
              Teks Asli
            </span>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-lg font-medium">{text}</p>
            </div>
          </div>
        )}

        {/* Braille Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Braille
            </span>
            {onSpeak && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onSpeak}
                aria-label="Dengarkan teks"
              >
                <Volume2 className="h-4 w-4 mr-1" aria-hidden="true" />
                Dengarkan
              </Button>
            )}
          </div>
          <div
            className="p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-blue-200 dark:border-blue-800"
            role="region"
            aria-label={braille ? `Teks Braille: ${dotDescription}` : "Output Braille"}
          >
            {braille ? (
              <>
                {/* Visual Braille */}
                <p
                  className="text-4xl md:text-5xl font-mono leading-relaxed tracking-wider select-all"
                  aria-hidden="true"
                >
                  {braille}
                </p>
                {/* Screen reader description */}
                <span className="sr-only">
                  {dotDescription}
                </span>
              </>
            ) : (
              <p className="text-slate-400 dark:text-slate-600 text-center">
                Masukkan teks untuk melihat hasil konversi Braille
              </p>
            )}
          </div>
        </div>

        {/* Character count */}
        {braille && (
          <div className="text-xs text-muted-foreground text-right">
            {text.length} karakter → {braille.replace(/\s/g, "").length} simbol Braille
          </div>
        )}
      </div>
    </Card>
  );
}
