"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { textToBraille } from "@/lib/braille";
import { Badge } from "@/components/ui/badge";

interface AutoConvertInputProps {
  value: string;
  onChange: (brailleValue: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function AutoConvertInput({ 
  value, 
  onChange, 
  disabled,
  placeholder = "Type text (auto-converts to Braille)..."
}: AutoConvertInputProps) {
  const [textInput, setTextInput] = useState("");

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setTextInput(text);
    
    // Auto convert to Braille
    const braille = textToBraille(text);
    onChange(braille);
  };

  return (
    <div className="space-y-3">
      {/* Text Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="text-input">Type text here:</Label>
          <Badge variant="secondary" className="text-xs">
            Auto-converting
          </Badge>
        </div>
        <Input
          id="text-input"
          placeholder={placeholder}
          value={textInput}
          onChange={handleTextChange}
          disabled={disabled}
          className="text-lg"
          autoFocus
        />
      </div>

      {/* Braille Output */}
      <div className="space-y-2">
        <Label htmlFor="braille-output">Your Braille answer:</Label>
        <div 
          id="braille-output"
          className="w-full p-4 border rounded-md bg-muted text-4xl font-bold text-center min-h-[80px] flex items-center justify-center"
        >
          {value || <span className="text-muted-foreground text-base">Braille will appear here...</span>}
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        💡 Tip: Just type normally, we&apos;ll convert it to Braille for you!
      </p>
    </div>
  );
}