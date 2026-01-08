"use client";

import { Card } from "@/components/ui/card";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Original Text */}
        {showText && text && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Text
            </label>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <p className="text-lg font-medium">{text}</p>
            </div>
          </div>
        )}

        {/* Braille Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Braille
            </label>
            {onSpeak && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onSpeak}
                aria-label="Read text aloud"
              >
                <Volume2 className="h-4 w-4 mr-1" />
                Speak
              </Button>
            )}
          </div>
          <div
            className="p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-blue-200 dark:border-blue-800"
            role="region"
            aria-label="Braille output"
          >
            {braille ? (
              <p
                className="text-4xl md:text-5xl font-mono leading-relaxed tracking-wider select-all"
                style={{ fontFamily: "monospace" }}
                aria-label={`Braille representation: ${text}`}
              >
                {braille}
              </p>
            ) : (
              <p className="text-slate-400 dark:text-slate-600 text-center">
                Enter text to see Braille conversion
              </p>
            )}
          </div>
        </div>

        {/* Character count */}
        {braille && (
          <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
            {text.length} characters → {braille.replace(/\s/g, "").length} Braille symbols
          </div>
        )}
      </div>
    </Card>
  );
}