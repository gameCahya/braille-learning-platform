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
      toast.error("Masukkan teks terlebih dahulu");
      return;
    }

    try {
      if (mode === "text-to-braille") {
        const braille = textToBraille(inputText);
        setOutputText(braille);
        toast.success("Berhasil dikonversi ke Braille");
      } else {
        if (!isValidBraille(inputText)) {
          toast.error("Karakter Braille tidak valid terdeteksi");
          return;
        }
        const text = brailleToText(inputText);
        setOutputText(text);
        toast.success("Berhasil dikonversi ke teks");
      }
    } catch (err) {
      console.error("Conversion error:", err);
      toast.error("Konversi gagal", {
        description: "Periksa input kamu dan coba lagi.",
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
      toast.error("Tidak ada yang bisa disalin");
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      toast.success("Disalin ke clipboard");
    } catch (err) {
      console.error("Copy error:", err);
      toast.error("Gagal menyalin");
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    toast.info("Dibersihkan");
  };

  const handleSpeak = () => {
    if (!inputText && !outputText) {
      toast.error("Tidak ada yang bisa dibacakan");
      return;
    }

    const textToSpeak = mode === "text-to-braille" ? inputText : outputText;

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Text-to-speech tidak didukung di browser kamu");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Konverter Braille</h1>
        <p className="text-muted-foreground mt-2">
          Konversi teks ke Braille dan sebaliknya
        </p>
      </div>

      {/* Mode Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mode Konversi</CardTitle>
              <CardDescription>
                {mode === "text-to-braille"
                  ? "Konversi teks biasa ke Braille"
                  : "Konversi Braille kembali ke teks"}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwapMode}
              aria-label="Tukar mode konversi"
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" aria-hidden="true" />
              Tukar
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "text-to-braille" ? "Masukkan Teks" : "Masukkan Braille"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="converter-input">
              {mode === "text-to-braille"
                ? "Teks yang akan dikonversi"
                : "Braille yang akan dikonversi"}
            </Label>
            <textarea
              id="converter-input"
              className="w-full min-h-[150px] p-4 rounded-lg border bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
              placeholder={
                mode === "text-to-braille"
                  ? "Ketik teks di sini..."
                  : "Tempel karakter Braille di sini..."
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              aria-label={mode === "text-to-braille" ? "Input teks" : "Input Braille"}
              style={
                mode === "braille-to-text"
                  ? { fontSize: "2rem", fontFamily: "monospace" }
                  : undefined
              }
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleConvert} className="flex-1">
              Konversi
            </Button>
            <Button variant="outline" onClick={handleClear} aria-label="Bersihkan input">
              <Trash2 className="h-4 w-4" aria-hidden="true" />
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
              <Copy className="h-4 w-4 mr-2" aria-hidden="true" />
              Salin {mode === "text-to-braille" ? "Braille" : "Teks"}
            </Button>
          </div>
        </div>
      )}

      {/* Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Contoh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3" role="list" aria-label="Contoh teks untuk dikonversi">
            <button
              onClick={() => setInputText("Hello World")}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Gunakan contoh: Hello World"
            >
              <div className="font-medium">Hello World</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Sapaan dasar
              </div>
            </button>
            <button
              onClick={() => setInputText("I love learning English")}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Gunakan contoh: I love learning English"
            >
              <div className="font-medium">I love learning English</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Kalimat dengan tanda baca
              </div>
            </button>
            <button
              onClick={() => setInputText("12345")}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Gunakan contoh: 12345"
            >
              <div className="font-medium">12345</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Angka
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
