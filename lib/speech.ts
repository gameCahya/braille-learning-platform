// lib/speech.ts
/**
 * Text-to-Speech Utility
 * Provides better voice quality and control for accessibility
 */

export interface SpeechOptions {
  rate?: number; // 0.1 to 10 (default: 1)
  pitch?: number; // 0 to 2 (default: 1)
  volume?: number; // 0 to 1 (default: 1)
  lang?: string; // default: 'en-US'
  voiceName?: string; // specific voice name
}

export class TextToSpeech {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window === "undefined") {
      throw new Error("TextToSpeech can only be used in browser environment");
    }
    this.synth = window.speechSynthesis;
    this.loadVoices();
  }

  /**
   * Load available voices
   */
  private loadVoices() {
    this.voices = this.synth.getVoices();

    // Chrome loads voices asynchronously
    if (this.voices.length === 0) {
      this.synth.addEventListener("voiceschanged", () => {
        this.voices = this.synth.getVoices();
      });
    }
  }

  /**
   * Get all available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  /**
   * Get recommended English voices (higher quality)
   */
  getEnglishVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter(
      (voice) =>
        voice.lang.startsWith("en-") &&
        (voice.name.includes("Google") ||
          voice.name.includes("Microsoft") ||
          voice.name.includes("Natural") ||
          voice.localService === false) // Remote voices usually better quality
    );
  }

  /**
   * Get best available voice
   */
  getBestVoice(): SpeechSynthesisVoice | null {
    // Priority order:
    // 1. Google voices (usually best quality)
    // 2. Microsoft voices
    // 3. Any remote English voice
    // 4. Any local English voice
    // 5. Default voice

    const googleVoice = this.voices.find(
      (v) => v.lang.startsWith("en-") && v.name.includes("Google")
    );
    if (googleVoice) return googleVoice;

    const microsoftVoice = this.voices.find(
      (v) => v.lang.startsWith("en-") && v.name.includes("Microsoft")
    );
    if (microsoftVoice) return microsoftVoice;

    const remoteEnglish = this.voices.find(
      (v) => v.lang.startsWith("en-") && !v.localService
    );
    if (remoteEnglish) return remoteEnglish;

    const localEnglish = this.voices.find((v) => v.lang.startsWith("en-"));
    if (localEnglish) return localEnglish;

    return this.voices[0] || null;
  }

  /**
   * Speak text with options
   */
  speak(text: string, options: SpeechOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      // Stop any ongoing speech
      this.stop();

      if (!text || text.trim().length === 0) {
        reject(new Error("No text provided"));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);

      // Set voice
      const bestVoice = this.getBestVoice();
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      // Set options with better defaults
      utterance.lang = options.lang || "en-US";
      utterance.rate = options.rate || 0.85; // Slightly slower for clarity
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      // Event listeners
      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        reject(new Error(`Speech error: ${event.error}`));
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  /**
   * Speak with spell mode (letter by letter)
   */
  spellOut(text: string, options: SpeechOptions = {}): Promise<void> {
    const letters = text.split("").join(" . ");
    return this.speak(letters, { ...options, rate: 0.7 });
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  /**
   * Pause speech
   */
  pause(): void {
    if (this.synth.speaking) {
      this.synth.pause();
    }
  }

  /**
   * Resume speech
   */
  resume(): void {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.synth.speaking;
  }

  /**
   * Check if paused
   */
  isPaused(): boolean {
    return this.synth.paused;
  }
}

// Singleton instance
let ttsInstance: TextToSpeech | null = null;

export function getTTS(): TextToSpeech {
  if (typeof window === "undefined") {
    throw new Error("TTS can only be used in browser");
  }

  if (!ttsInstance) {
    ttsInstance = new TextToSpeech();
  }

  return ttsInstance;
}

// Simple helper function
export function speak(text: string, options?: SpeechOptions): Promise<void> {
  return getTTS().speak(text, options);
}

export function stopSpeaking(): void {
  getTTS().stop();
}