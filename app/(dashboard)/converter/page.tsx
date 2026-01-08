"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeftRight, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { textToBraille, brailleToText, isValidBraille } from "@/lib/braille";
import BrailleDisplay from "@/components/braille/BrailleDisplay";

type ConversionMode = "text-to-braille" | "braille-to-text";

export default function BrailleConverterPage() {
  const [mode, setMode] = useState<ConversionMode>("text-to-braille");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const handleConvert = () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text");
      return;
    }

    try {
      if (mode === "text-to-braille") {
        const braille = textToBraille(inputText);
        setOutputText(braille);
        toast.success("Converted to Braille");
      } else {
        if (!isValidBraille(inputText)) {
          toast.error("Invalid Braille characters detected");
          return;
        }
        const text = brailleToText(inputText);
        setOutputText(text);
        toast.success("Converted to text");
      }
    } catch (err) {
      console.error("Conversion error:", err);
      toast.error("Conversion failed", {
        description: "Please check your input and try again.",
      });
    }
  };

  const handleSwapMode = () => {
    setMode((prev) =>
      prev === "text-to-braille" ? "braille-to-text" : "text-to-braille"
    );
    setInputText("");
    setOutputText("");
  };

  const handleCopyOutput = async () => {
    if (!outputText) {
      toast.error("Nothing to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Copy error:", err);
      toast.error("Failed to copy");
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    toast.info("Cleared");
  };

  const handleSpeak = () => {
    if (!inputText && !outputText) {
      toast.error("Nothing to speak");
      return;
    }

    const textToSpeak = mode === "text-to-braille" ? inputText : outputText;

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Text-to-speech not supported in your browser");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Braille Converter</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Convert text to Braille and vice versa
        </p>
      </div>

      {/* Mode Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Conversion Mode</CardTitle>
              <CardDescription>
                {mode === "text-to-braille"
                  ? "Convert regular text to Braille"
                  : "Convert Braille back to text"}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwapMode}
              aria-label="Swap conversion mode"
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Swap
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "text-to-braille" ? "Enter Text" : "Enter Braille"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input">
              {mode === "text-to-braille"
                ? "Text to convert"
                : "Braille to convert"}
            </Label>
            <textarea
              id="input"
              className="w-full min-h-[150px] p-4 rounded-lg border bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
              placeholder={
                mode === "text-to-braille"
                  ? "Type your text here..."
                  : "Paste Braille characters here..."
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={
                mode === "braille-to-text"
                  ? { fontSize: "2rem", fontFamily: "monospace" }
                  : undefined
              }
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleConvert} className="flex-1">
              Convert
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output Section */}
      {outputText && (
        <div className="space-y-4">
          <BrailleDisplay
            text={mode === "text-to-braille" ? inputText : outputText}
            braille={mode === "text-to-braille" ? outputText : inputText}
            showText={mode === "braille-to-text"}
            onSpeak={handleSpeak}
          />

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopyOutput} className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copy {mode === "text-to-braille" ? "Braille" : "Text"}
            </Button>
          </div>
        </div>
      )}

      {/* Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <button
              onClick={() => setInputText("Hello World")}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="font-medium">Hello World</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Basic greeting
              </div>
            </button>
            <button
              onClick={() => setInputText("I love learning English")}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="font-medium">I love learning English</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Sentence with punctuation
              </div>
            </button>
            <button
              onClick={() => setInputText("12345")}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="font-medium">12345</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Numbers
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}