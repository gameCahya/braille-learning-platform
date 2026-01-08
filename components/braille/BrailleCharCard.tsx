"use client";

import { Card } from "@/components/ui/card";

interface BrailleCharCardProps {
  char: string;
  braille: string;
  dots?: string;
  description?: string;
}

export default function BrailleCharCard({
  char,
  braille,
  dots,
  description,
}: BrailleCharCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col items-center space-y-2">
        {/* Character */}
        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {char}
        </div>

        {/* Braille */}
        <div
          className="text-5xl font-mono"
          aria-label={`Braille for ${char}`}
        >
          {braille}
        </div>

        {/* Dots pattern */}
        {dots && (
          <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
            Dots: {dots}
          </div>
        )}

        {/* Description */}
        {description && (
          <div className="text-xs text-center text-slate-500 dark:text-slate-400">
            {description}
          </div>
        )}
      </div>
    </Card>
  );
}