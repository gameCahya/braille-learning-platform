"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { textToBraille } from "@/lib/braille";
import { speak } from "@/lib/speech";
import { Volume2, Keyboard, Type, Check } from "lucide-react";

interface AccessibleBrailleInputProps {
  value: string;
  onChange: (value: string) => void;
  targetWord: string;
  onSubmit: () => void;
  disabled?: boolean;
}

type InputMode = "text" | "audio" | "keyboard";

/**
 * FULLY ACCESSIBLE Braille Input
 * Supports 3 input methods:
 * 1. TEXT MODE: Type normally, auto-converts to Braille
 * 2. AUDIO MODE: Navigate letters with arrow keys, select with Enter
 * 3. KEYBOARD MODE: Visual keyboard (for sighted users)
 */
export function AccessibleBrailleInput({
  value,
  onChange,
  targetWord,
  onSubmit,
  disabled = false
}: AccessibleBrailleInputProps) {
  const [mode, setMode] = useState<InputMode>("text");
  const [textInput, setTextInput] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(0);
  const audioModeRef = useRef<HTMLDivElement>(null);

  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const targetLength = targetWord.length;

  // Auto-convert text to Braille
  const handleTextInput = (text: string) => {
    setTextInput(text);
    const braille = textToBraille(text);
    onChange(braille);
  };

  // Audio mode: Navigate with arrows
  const handleAudioNavigation = useCallback((direction: "prev" | "next") => {
    setSelectedLetter((current) => {
      const newIndex = direction === "next" 
        ? (current + 1) % alphabet.length
        : (current - 1 + alphabet.length) % alphabet.length;
      
      speak(alphabet[newIndex].toUpperCase(), { rate: 1.0 });
      return newIndex;
    });
  }, [alphabet]);

  // Audio mode: Select current letter
  const handleAudioSelect = useCallback(() => {
    const letter = alphabet[selectedLetter];
    const braille = textToBraille(letter);
    onChange(value + braille);
    speak(`Added ${letter.toUpperCase()}`, { rate: 1.0 });
  }, [alphabet, selectedLetter, value, onChange]);

  // Handle delete
  const handleDelete = useCallback(() => {
    onChange(value.slice(0, -1));
    speak("Deleted", { rate: 1.0 });
  }, [value, onChange]);

  // Keyboard navigation for audio mode
  useEffect(() => {
    if (mode !== "audio") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          handleAudioNavigation("next");
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          handleAudioNavigation("prev");
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          handleAudioSelect();
          break;
        case "Backspace":
          e.preventDefault();
          handleDelete();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, handleAudioNavigation, handleAudioSelect, handleDelete]);

  // Announce mode change
  const changeMode = (newMode: InputMode) => {
    setMode(newMode);
    
    const announcements = {
      text: "Text mode: Type normally to convert to Braille",
      audio: "Audio mode: Use arrow keys to navigate, Enter to select",
      keyboard: "Keyboard mode: Click Braille characters to type"
    };
    
    speak(announcements[newMode], { rate: 0.9 });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Input Method</CardTitle>
        <CardDescription>
          Choose how you want to input Braille characters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Selection */}
        <div 
          role="radiogroup" 
          aria-label="Input mode selection"
          className="grid gap-3 md:grid-cols-3"
        >
          <Button
            variant={mode === "text" ? "default" : "outline"}
            className="h-20 flex flex-col"
            onClick={() => changeMode("text")}
            role="radio"
            aria-checked={mode === "text"}
            aria-label="Text mode: Type normally"
          >
            <Type className="h-5 w-5 mb-2" />
            <span className="text-sm">Text Mode</span>
            <span className="text-xs text-muted-foreground">Easy</span>
          </Button>

          <Button
            variant={mode === "audio" ? "default" : "outline"}
            className="h-20 flex flex-col"
            onClick={() => changeMode("audio")}
            role="radio"
            aria-checked={mode === "audio"}
            aria-label="Audio mode: Navigate with keyboard"
          >
            <Volume2 className="h-5 w-5 mb-2" />
            <span className="text-sm">Audio Mode</span>
            <span className="text-xs text-muted-foreground">Accessible</span>
          </Button>

          <Button
            variant={mode === "keyboard" ? "default" : "outline"}
            className="h-20 flex flex-col"
            onClick={() => changeMode("keyboard")}
            role="radio"
            aria-checked={mode === "keyboard"}
            aria-label="Visual keyboard mode"
          >
            <Keyboard className="h-5 w-5 mb-2" />
            <span className="text-sm">Visual Keyboard</span>
            <span className="text-xs text-muted-foreground">Advanced</span>
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-2" role="status" aria-live="polite">
          <div className="flex items-center justify-between">
            <Label>Progress:</Label>
            <Badge variant="secondary">
              {value.length} / {targetLength} characters
            </Badge>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: targetLength }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded ${
                  i < value.length ? "bg-primary" : "bg-muted"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Current Input Display */}
        <div className="space-y-2">
          <Label htmlFor="braille-output">Your Braille Answer:</Label>
          <div
            id="braille-output"
            role="textbox"
            aria-readonly="true"
            aria-label={`Current answer: ${value || "empty"}`}
            className="w-full p-6 border-2 rounded-lg bg-muted text-5xl font-bold text-center min-h-[120px] flex items-center justify-center"
          >
            {value || (
              <span className="text-muted-foreground text-base">
                Your Braille will appear here
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => speak(value || "No input yet", { rate: 0.8 })}
            className="w-full"
          >
            <Volume2 className="mr-2 h-4 w-4" />
            Listen to Your Answer
          </Button>
        </div>

        {/* TEXT MODE */}
        {mode === "text" && (
          <div className="space-y-3" role="region" aria-label="Text input mode">
            <Label htmlFor="text-input">
              Type the word "{targetWord}" in regular letters:
            </Label>
            <input
              id="text-input"
              type="text"
              placeholder={`Type "${targetWord}"...`}
              value={textInput}
              onChange={(e) => handleTextInput(e.target.value)}
              disabled={disabled}
              className="w-full p-3 text-lg border rounded-md"
              aria-describedby="text-mode-help"
              autoFocus
            />
            <p id="text-mode-help" className="text-sm text-muted-foreground">
              💡 Just type normally, we'll convert it to Braille automatically!
            </p>
          </div>
        )}

        {/* AUDIO MODE */}
        {mode === "audio" && (
          <div 
            ref={audioModeRef}
            className="space-y-4" 
            role="region" 
            aria-label="Audio navigation mode"
            tabIndex={0}
          >
            <div 
              className="p-8 bg-primary/10 rounded-lg text-center"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="text-6xl font-bold mb-2">
                {alphabet[selectedLetter].toUpperCase()}
              </div>
              <div className="text-4xl font-bold text-primary mb-2">
                {textToBraille(alphabet[selectedLetter])}
              </div>
              <p className="text-sm text-muted-foreground">
                Letter {selectedLetter + 1} of {alphabet.length}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-sm">Keyboard Controls:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>← ↑ Previous letter</li>
                <li>→ ↓ Next letter</li>
                <li>Enter/Space: Select letter</li>
                <li>Backspace: Delete last</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleAudioNavigation("prev")}
                aria-label="Previous letter"
                size="lg"
              >
                ← Previous
              </Button>
              <Button
                onClick={() => handleAudioNavigation("next")}
                aria-label="Next letter"
                size="lg"
              >
                Next →
              </Button>
              <Button
                onClick={handleAudioSelect}
                variant="default"
                className="col-span-2"
                aria-label={`Select ${alphabet[selectedLetter].toUpperCase()}`}
                size="lg"
              >
                <Check className="mr-2 h-4 w-4" />
                Select {alphabet[selectedLetter].toUpperCase()}
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                className="col-span-2"
                disabled={value.length === 0}
                aria-label="Delete last character"
                size="lg"
              >
                ⌫ Delete Last
              </Button>
            </div>
          </div>
        )}

        {/* KEYBOARD MODE (Visual) */}
        {mode === "keyboard" && (
          <div className="space-y-3" role="region" aria-label="Visual keyboard">
            <p className="text-sm text-muted-foreground">
              Click on Braille characters to type:
            </p>
            <div className="grid grid-cols-7 gap-2">
              {alphabet.map((letter) => {
                const braille = textToBraille(letter);
                return (
                  <Button
                    key={letter}
                    variant="outline"
                    className="h-16 flex flex-col hover:bg-primary hover:text-primary-foreground"
                    onClick={() => onChange(value + braille)}
                    aria-label={`Type ${letter.toUpperCase()}, Braille ${braille}`}
                    disabled={disabled}
                  >
                    <span className="text-2xl">{braille}</span>
                    <span className="text-xs mt-1">{letter}</span>
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleDelete}
              disabled={value.length === 0 || disabled}
              aria-label="Delete last character"
            >
              ⌫ Backspace
            </Button>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={onSubmit}
          disabled={disabled || value.length === 0}
          size="lg"
          className="w-full"
          aria-label="Submit your answer"
        >
          <Check className="mr-2 h-4 w-4" />
          Check Answer
        </Button>
      </CardContent>
    </Card>
  );
}