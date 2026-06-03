"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { AccessibleBrailleInput } from "@/components/braille/AccessibleBrailleInput";
import { textToBraille, brailleStringToDescription } from "@/lib/braille";
import { speak, stopSpeaking } from "@/lib/speech";
import { BookOpen, Zap, Award, RotateCcw, Volume2, VolumeX, Headphones } from "lucide-react";
import { toast } from "sonner";
import TutorialDriver from "@/components/tutorial/TutorialDriver";
import { practiceSteps } from "@/lib/tutorial/steps";

type ExerciseType = "flashcard" | "braille-to-text" | "text-to-braille";
type Difficulty = "easy" | "medium" | "hard";

interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  answer: string;
  braille?: string;
  difficulty: Difficulty;
}

interface PracticeClientProps {
  gradeLevel: string | null;
  role: string;
}

function generateExercises(type: ExerciseType, difficulty: Difficulty, count: number = 10): Exercise[] {
  const exercises: Exercise[] = [];

  const wordPools = {
    easy: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
    medium: ["cat", "dog", "the", "and", "but", "yes", "no", "hi", "go", "me"],
    hard: ["hello", "world", "learn", "study", "braille", "teach", "read", "write", "think", "speak"]
  };

  const words = wordPools[difficulty];

  for (let i = 0; i < count; i++) {
    const word = words[i % words.length];
    const braille = textToBraille(word);

    switch (type) {
      case "flashcard":
        exercises.push({ id: `flash-${i}`, type: "flashcard", question: word, answer: braille, braille, difficulty });
        break;
      case "braille-to-text":
        exercises.push({ id: `b2t-${i}`, type: "braille-to-text", question: braille, answer: word.toLowerCase(), braille, difficulty });
        break;
      case "text-to-braille":
        exercises.push({ id: `t2b-${i}`, type: "text-to-braille", question: word, answer: braille, braille, difficulty });
        break;
    }
  }

  return exercises;
}

export default function PracticeClient({ gradeLevel, role }: PracticeClientProps) {
  const [exerciseType, setExerciseType] = useState<ExerciseType | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioMode, setAudioMode] = useState(false);

  const currentExercise = exercises[currentIndex];
  const progress = exercises.length > 0 ? ((currentIndex + 1) / exercises.length) * 100 : 0;
  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  // Mode Dengar: auto-speak soal saat muncul
  useEffect(() => {
    if (audioMode && currentExercise && !showAnswer) {
      const textToRead = currentExercise.type === "braille-to-text"
        ? `Soal Braille: ${brailleStringToDescription(currentExercise.question)}`
        : currentExercise.question;
      const timer = setTimeout(() => handleSpeak(textToRead), 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, audioMode, exerciseType]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSpeak = async (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    try {
      setIsSpeaking(true);
      await speak(text, { rate: 0.85, pitch: 1.0, volume: 1.0 });
      setIsSpeaking(false);
    } catch (error) {
      console.error("Speech error:", error);
      toast.error("Tidak dapat memutar audio");
      setIsSpeaking(false);
    }
  };

  const startPractice = (type: ExerciseType, diff: Difficulty) => {
    stopSpeaking();
    setExerciseType(type);
    setDifficulty(diff);
    const newExercises = generateExercises(type, diff);
    setExercises(newExercises);
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    setIsComplete(false);
    setUserAnswer("");
    setShowAnswer(false);
    setIsSpeaking(false);
  };

  const checkAnswer = () => {
    if (!currentExercise || !userAnswer.trim()) return;
    const isCorrect = userAnswer.trim().toLowerCase() === currentExercise.answer.toLowerCase();
    setScore((prev) => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }));
    setStreak((prev) => (isCorrect ? prev + 1 : 0));
    if (isCorrect) {
      toast.success("Benar! 🎉");
      speak("Correct!", { rate: 1.0 });
      setTimeout(() => nextExercise(), 1500);
    } else {
      const answerText = currentExercise.type === "text-to-braille" || currentExercise.type === "flashcard"
        ? currentExercise.question
        : currentExercise.answer;
      toast.error(`Belum tepat. Jawabannya: ${answerText}`);
      speak(`Incorrect. The correct answer is ${answerText}`, { rate: 0.9 });
      setShowAnswer(true);
    }
  };

  const nextExercise = () => {
    stopSpeaking();
    setIsSpeaking(false);
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer("");
      setShowAnswer(false);
    } else {
      setIsComplete(true);
      const finalScore = score.correct + 1;
      toast.success(`Latihan selesai! Skor: ${finalScore}/${exercises.length}`);
      speak(`Practice complete! You got ${finalScore} out of ${exercises.length} correct.`, { rate: 0.9 });
    }
  };

  const flipCard = () => {
    const newShowAnswer = !showAnswer;
    setShowAnswer(newShowAnswer);
    handleSpeak(newShowAnswer ? currentExercise.answer : currentExercise.question);
  };

  const resetSession = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setExerciseType(null);
    setExercises([]);
    setCurrentIndex(0);
    setUserAnswer("");
    setShowAnswer(false);
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    setIsComplete(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !showAnswer) checkAnswer();
  };

  if (!exerciseType) {
    return (
      <div className="space-y-8">
        <div id="practice-header">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Latihan Braille</h1>
          <p className="text-muted-foreground">
            Pilih jenis dan tingkat kesulitan latihan untuk memulai.
          </p>
        </div>

        {/* Grade level banner for students */}
        {role === "student" && gradeLevel && (
          <div className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-3 flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
            <div>
              <p className="font-semibold text-sm text-foreground">Kelas {gradeLevel}</p>
              <p className="text-xs text-muted-foreground">
                Materi latihan disesuaikan untuk tingkat kelasmu.
              </p>
            </div>
          </div>
        )}

        <Card id="accessibility-notice" className="border-primary bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Volume2 className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
              <div className="space-y-2">
                <p className="font-medium">♿ Dapat Diakses untuk Semua Pengguna</p>
                <p className="text-sm text-muted-foreground">
                  Platform ini mendukung <strong>Mode Audio</strong> untuk pengguna pembaca layar,{" "}
                  <strong>Mode Teks</strong> untuk input mudah, dan{" "}
                  <strong>Keyboard Visual</strong> untuk pembelajaran interaktif.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div id="practice-types" className="grid gap-6 md:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
                <CardTitle className="text-lg">Flashcards</CardTitle>
              </div>
              <CardDescription>Tinjau karakter Braille dengan kartu interaktif</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => startPractice("flashcard", "easy")} className="w-full" variant="outline">Mudah — Huruf</Button>
              <Button onClick={() => startPractice("flashcard", "medium")} className="w-full" variant="outline">Sedang — Kata 3 Huruf</Button>
              <Button onClick={() => startPractice("flashcard", "hard")} className="w-full" variant="outline">Sulit — Kata 5 Huruf</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
                <CardTitle className="text-lg">Braille → Teks</CardTitle>
              </div>
              <CardDescription>Baca Braille dan ketik teks menggunakan keyboard biasa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => startPractice("braille-to-text", "easy")} className="w-full" variant="outline">Mudah — Huruf</Button>
              <Button onClick={() => startPractice("braille-to-text", "medium")} className="w-full" variant="outline">Sedang — Kata 3 Huruf</Button>
              <Button onClick={() => startPractice("braille-to-text", "hard")} className="w-full" variant="outline">Sulit — Kata 5 Huruf</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-primary">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-primary" aria-hidden="true" />
                <CardTitle className="text-lg">Teks → Braille</CardTitle>
              </div>
              <CardDescription>Konversi teks ke Braille (3 mode input tersedia)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => startPractice("text-to-braille", "easy")} className="w-full" variant="outline">Mudah — Huruf</Button>
              <Button onClick={() => startPractice("text-to-braille", "medium")} className="w-full" variant="outline">Sedang — Kata 3 Huruf</Button>
              <Button onClick={() => startPractice("text-to-braille", "hard")} className="w-full" variant="outline">Sulit — Kata 5 Huruf</Button>
            </CardContent>
          </Card>
        </div>

        <TutorialDriver steps={practiceSteps} storageKey="bralingo-tutorial-practice" />
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Latihan Selesai! 🎉</CardTitle>
            <CardDescription className="text-center">Kerja bagus! Berikut hasil kamu:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold text-primary">{accuracy}%</div>
                <div className="text-sm text-muted-foreground">Akurasi</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold text-primary">{score.correct}/{score.total}</div>
                <div className="text-sm text-muted-foreground">Jawaban Benar</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold text-primary">{streak}</div>
                <div className="text-sm text-muted-foreground">Streak Terbaik</div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={resetSession} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                Kembali ke Menu
              </Button>
              <Button onClick={() => startPractice(exerciseType, difficulty)}>Coba Lagi</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {exerciseType === "flashcard" && "Latihan Flashcard"}
            {exerciseType === "braille-to-text" && "Braille → Teks"}
            {exerciseType === "text-to-braille" && "Teks → Braille"}
          </h1>
          <p className="text-sm text-muted-foreground capitalize">
            Tingkat {difficulty === "easy" ? "Mudah" : difficulty === "medium" ? "Sedang" : "Sulit"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">{currentIndex + 1} / {exercises.length}</Badge>
          <Badge variant="secondary" className="text-sm">{accuracy}% Akurasi</Badge>
          {streak > 0 && <Badge className="text-sm">🔥 {streak} Streak</Badge>}
        </div>
      </div>

      {/* Mode Dengar toggle */}
      <div className="flex items-center justify-end gap-2">
        <Headphones className={`h-4 w-4 ${audioMode ? "text-primary" : "text-muted-foreground"}`} aria-hidden="true" />
        <label htmlFor="audio-mode-toggle" className="text-sm text-muted-foreground cursor-pointer select-none">
          Mode Dengar
        </label>
        <Switch
          id="audio-mode-toggle"
          checked={audioMode}
          onCheckedChange={(checked) => {
            stopSpeaking();
            setAudioMode(checked);
            if (!checked) setIsSpeaking(false);
          }}
          aria-label="Aktifkan mode dengar untuk membacakan soal secara otomatis"
        />
      </div>
      <div aria-live="polite" className="sr-only">
        {audioMode ? "Mode dengar aktif. Soal akan dibacakan otomatis." : ""}
      </div>

      <div role="region" aria-label="Progress latihan" className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground text-right sr-only">
          Progress: {Math.round(progress)}% selesai
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          {currentExercise && (
            <>
              {currentExercise.type === "flashcard" && (
                <div className="space-y-6">
                  <div
                    className="min-h-[300px] flex items-center justify-center bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={flipCard}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && flipCard()}
                    aria-label={showAnswer ? "Sembunyikan jawaban. Tekan Enter untuk membalik" : "Tampilkan jawaban. Tekan Enter untuk membalik"}
                  >
                    <div className="text-center space-y-4">
                      <div className="text-6xl font-bold" aria-hidden={showAnswer ? "true" : undefined}>
                        {showAnswer ? currentExercise.answer : currentExercise.question}
                      </div>
                      {showAnswer && currentExercise.braille && (
                        <p className="text-sm font-medium text-foreground">
                          {brailleStringToDescription(currentExercise.braille)}
                        </p>
                      )}
                      {showAnswer && (
                        <span className="sr-only">
                          Deskripsi titik: {currentExercise.braille ? brailleStringToDescription(currentExercise.braille) : ""}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleSpeak(currentExercise.question); }}
                        aria-label={isSpeaking ? "Hentikan audio" : `Dengarkan: ${currentExercise.question}`}
                      >
                        {isSpeaking ? <VolumeX className="h-4 w-4 mr-2" aria-hidden="true" /> : <Volume2 className="h-4 w-4 mr-2" aria-hidden="true" />}
                        {isSpeaking ? "Stop" : "Dengarkan"}
                      </Button>
                    </div>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">Klik kartu atau tekan Enter untuk membalik</div>
                  <div className="flex justify-center">
                    <Button onClick={nextExercise} size="lg">Kartu Selanjutnya</Button>
                  </div>
                </div>
              )}

              {currentExercise.type === "braille-to-text" && (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <label className="text-sm font-medium">Apa artinya ini?</label>
                    <div
                      className="text-6xl font-bold min-h-[200px] flex items-center justify-center bg-muted rounded-lg"
                      role="img"
                      aria-label={`Karakter Braille: ${currentExercise.question}`}
                    >
                      {currentExercise.question as React.ReactNode}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleSpeak(currentExercise.answer)} aria-label="Dengarkan jawabannya">
                      {isSpeaking ? <VolumeX className="h-4 w-4 mr-2" aria-hidden="true" /> : <Volume2 className="h-4 w-4 mr-2" aria-hidden="true" />}
                      {isSpeaking ? "Stop" : "Dengarkan Jawaban"}
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <Input
                      placeholder="Ketik jawaban kamu..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={handleKeyPress}
                      disabled={showAnswer}
                      className="text-lg text-center"
                      autoFocus
                      aria-label="Jawaban kamu"
                      aria-describedby={showAnswer ? "answer-feedback" : undefined}
                    />
                    {showAnswer && (
                      <div id="answer-feedback" className="p-4 bg-destructive/10 rounded-lg text-center" role="alert">
                        <p className="text-sm text-muted-foreground mb-2">Jawaban yang benar:</p>
                        <p className="text-2xl font-bold">{currentExercise.answer}</p>
                        {/* Untuk Braille→Text, jawaban adalah teks biasa — tidak perlu deskripsi */}
                      </div>
                    )}
                    <div className="flex justify-center gap-4">
                      {!showAnswer ? (
                        <Button onClick={checkAnswer} size="lg" disabled={!userAnswer.trim()}>Periksa Jawaban</Button>
                      ) : (
                        <Button onClick={nextExercise} size="lg">Soal Selanjutnya</Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentExercise.type === "text-to-braille" && (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <label className="text-lg font-medium">Konversi kata ini ke Braille:</label>
                    <div className="text-5xl font-bold min-h-[120px] flex items-center justify-center bg-muted rounded-lg">
                      {currentExercise.question}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleSpeak(currentExercise.question)} aria-label="Dengarkan kata">
                      {isSpeaking ? <VolumeX className="h-4 w-4 mr-2" aria-hidden="true" /> : <Volume2 className="h-4 w-4 mr-2" aria-hidden="true" />}
                      {isSpeaking ? "Stop" : "Dengarkan"}
                    </Button>
                  </div>
                  <AccessibleBrailleInput
                    value={userAnswer}
                    onChange={setUserAnswer}
                    targetWord={currentExercise.question}
                    onSubmit={checkAnswer}
                    disabled={showAnswer}
                  />
                  {showAnswer && (
                    <div className="p-4 bg-destructive/10 rounded-lg text-center" role="alert">
                      <p className="text-sm text-muted-foreground mb-2">Jawaban yang benar:</p>
                      <p className="text-4xl font-bold" aria-hidden="true">{currentExercise.answer}</p>
                      <p className="text-sm font-medium text-foreground mt-1">
                        {currentExercise.braille ? brailleStringToDescription(currentExercise.braille) : currentExercise.answer}
                      </p>
                      <span className="sr-only">Deskripsi titik: {currentExercise.braille ? brailleStringToDescription(currentExercise.braille) : ""}</span>
                    </div>
                  )}
                  {showAnswer && (
                    <div className="flex justify-center">
                      <Button onClick={nextExercise} size="lg">Soal Selanjutnya</Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button onClick={resetSession} variant="ghost">
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
          Keluar Latihan
        </Button>
        <div className="text-sm text-muted-foreground" role="status" aria-live="polite">
          Skor: {score.correct} / {score.total}
        </div>
      </div>
    </div>
  );
}
