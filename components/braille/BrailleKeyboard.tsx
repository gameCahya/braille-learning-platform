"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

interface BrailleKeyboardProps {
  onInput: (char: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

// Braille characters mapping
const BRAILLE_CHARS = {
  alphabet: [
    { char: "a", braille: "⠁" },
    { char: "b", braille: "⠃" },
    { char: "c", braille: "⠉" },
    { char: "d", braille: "⠙" },
    { char: "e", braille: "⠑" },
    { char: "f", braille: "⠋" },
    { char: "g", braille: "⠛" },
    { char: "h", braille: "⠓" },
    { char: "i", braille: "⠊" },
    { char: "j", braille: "⠚" },
    { char: "k", braille: "⠅" },
    { char: "l", braille: "⠇" },
    { char: "m", braille: "⠍" },
    { char: "n", braille: "⠝" },
    { char: "o", braille: "⠕" },
    { char: "p", braille: "⠏" },
    { char: "q", braille: "⠟" },
    { char: "r", braille: "⠗" },
    { char: "s", braille: "⠎" },
    { char: "t", braille: "⠞" },
    { char: "u", braille: "⠥" },
    { char: "v", braille: "⠧" },
    { char: "w", braille: "⠺" },
    { char: "x", braille: "⠭" },
    { char: "y", braille: "⠽" },
    { char: "z", braille: "⠵" },
  ],
  space: { char: "space", braille: " " },
};

export function BrailleKeyboard({ onInput, onBackspace, onClear }: BrailleKeyboardProps) {
  return (
    <Card className="p-4 bg-muted/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Braille Keyboard</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-8"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>

        {/* Alphabet Grid */}
        <div className="grid grid-cols-7 gap-2">
          {BRAILLE_CHARS.alphabet.map(({ char, braille }) => (
            <Button
              key={char}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center hover:bg-primary hover:text-primary-foreground"
              onClick={() => onInput(braille)}
              title={`${char.toUpperCase()} - ${braille}`}
            >
              <span className="text-2xl font-bold">{braille}</span>
              <span className="text-xs text-muted-foreground mt-1">{char}</span>
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 h-12"
            onClick={() => onInput(BRAILLE_CHARS.space.braille)}
          >
            Space
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-12"
            onClick={onBackspace}
          >
            ⌫ Backspace
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Click on Braille characters to type
        </p>
      </div>
    </Card>
  );
}