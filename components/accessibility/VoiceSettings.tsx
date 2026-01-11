"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getTTS, speak } from "@/lib/speech";
import { Volume2, VolumeX } from "lucide-react";

export function VoiceSettings() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState(0.85);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const tts = getTTS();
      const availableVoices = tts.getEnglishVoices();
      
      // Only update if voices are actually loaded
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        
        const bestVoice = tts.getBestVoice();
        if (bestVoice) {
          setSelectedVoice(bestVoice.name);
        }
      }
    };

    // Initial load
    loadVoices();

    // Listen for voices changed event (Chrome loads voices async)
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
      
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      };
    }
  }, []);

  const testVoice = async () => {
    if (isSpeaking) {
      getTTS().stop();
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);
      await speak("Hello! This is how I sound. I will help you learn Braille.", {
        rate,
        pitch,
        volume,
        voiceName: selectedVoice
      });
      setIsSpeaking(false);
    } catch (error) {
      console.error("Test voice error:", error);
      setIsSpeaking(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Settings</CardTitle>
        <CardDescription>
          Customize the text-to-speech voice for better clarity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voice Selection */}
        <div className="space-y-2">
          <Label htmlFor="voice-select">Voice</Label>
          <select
            id="voice-select"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full p-2 border rounded-md bg-background"
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            {voices.length > 0 
              ? `${voices.length} high-quality voices available`
              : "Loading voices..."}
          </p>
        </div>

        {/* Speed/Rate */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="rate-slider">Speed</Label>
            <span className="text-sm text-muted-foreground">{rate.toFixed(2)}x</span>
          </div>
          <Slider
            id="rate-slider"
            min={0.5}
            max={2.0}
            step={0.05}
            value={[rate]}
            onValueChange={(value) => setRate(value[0])}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Slower = clearer (recommended: 0.85)
          </p>
        </div>

        {/* Pitch */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="pitch-slider">Pitch</Label>
            <span className="text-sm text-muted-foreground">{pitch.toFixed(2)}</span>
          </div>
          <Slider
            id="pitch-slider"
            min={0.5}
            max={2.0}
            step={0.1}
            value={[pitch]}
            onValueChange={(value) => setPitch(value[0])}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Normal pitch is 1.0
          </p>
        </div>

        {/* Volume */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="volume-slider">Volume</Label>
            <span className="text-sm text-muted-foreground">{Math.round(volume * 100)}%</span>
          </div>
          <Slider
            id="volume-slider"
            min={0}
            max={1}
            step={0.1}
            value={[volume]}
            onValueChange={(value) => setVolume(value[0])}
            className="w-full"
          />
        </div>

        {/* Test Button */}
        <Button onClick={testVoice} className="w-full" size="lg">
          {isSpeaking ? (
            <>
              <VolumeX className="mr-2 h-4 w-4" />
              Stop Test
            </>
          ) : (
            <>
              <Volume2 className="mr-2 h-4 w-4" />
              Test Voice
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}