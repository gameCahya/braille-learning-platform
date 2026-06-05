"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { textToBraille, getBrailleDots, formatDotDescription, brailleStringToDescription } from "@/lib/braille";
import { speak, stopSpeaking } from "@/lib/speech";
import { BookOpen, Zap, Award, RotateCcw, Volume2, VolumeX, Headphones, Ear, Hash } from "lucide-react";
import { toast } from "sonner";
import TutorialDriver from "@/components/tutorial/TutorialDriver";
import { practiceSteps } from "@/lib/tutorial/steps";

type TeacherMode = "flashcard" | "braille-to-text" | "text-to-braille";
type StudentMode = "listen-type" | "guess-letter" | "dictation-numbers";
type Difficulty = "easy" | "medium" | "hard";

interface Exercise {
  id: string;
  question: string; // yang ditampilkan / dibacakan
  answer: string;   // jawaban benar
  braille?: string;
  difficulty: Difficulty;
}

interface PracticeClientProps {
  gradeLevel: string | null;
  role: string;
}

// ====== Generate untuk GURU (visual modes) ======
function generateTeacherExercises(mode: TeacherMode, difficulty: Difficulty, count = 10): Exercise[] {
  const wordPools = {
    easy: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
    medium: ["cat", "dog", "the", "and", "but", "yes", "no", "hi", "go", "me"],
    hard: ["hello", "world", "learn", "study", "braille", "teach", "read", "write", "think", "speak"],
  };
  const words = wordPools[difficulty];
  const exercises: Exercise[] = [];

  for (let i = 0; i < count; i++) {
    const word = words[i % words.length];
    const braille = textToBraille(word);

    switch (mode) {
      case "flashcard":
        exercises.push({ id: `f-${i}`, question: word, answer: braille, braille, difficulty });
        break;
      case "braille-to-text":
        exercises.push({ id: `b2t-${i}`, question: braille, answer: word.toLowerCase(), braille, difficulty });
        break;
      case "text-to-braille":
        exercises.push({ id: `t2b-${i}`, question: word, answer: braille, braille, difficulty });
        break;
    }
  }
  return exercises;
}

// ====== Generate untuk SISWA (audio-only) ======
function generateStudentExercises(mode: StudentMode, difficulty: Difficulty, count = 10): Exercise[] {
  const letters = "abcdefghij".split("");
  const wordsEasy = ["cat", "dog", "the", "and", "yes", "no", "hi", "go", "me", "red"];
  const wordsMedium = ["hello", "world", "learn", "study", "braille", "teach", "read", "write", "think", "speak"];
  const numbers = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

  const exercises: Exercise[] = [];

  for (let i = 0; i < count; i++) {
    switch (mode) {
      case "listen-type": {
        const pool = difficulty === "easy" ? wordsEasy : difficulty === "medium" ? wordsMedium : wordsMedium;
        const word = pool[i % pool.length];
        exercises.push({ id: `lt-${i}`, question: word, answer: word, difficulty });
        break;
      }
      case "guess-letter": {
        const letter = letters[i % letters.length];
        const dots = getBrailleDots(letter);
        const desc = formatDotDescription(dots);
        exercises.push({ id: `gl-${i}`, question: `titik ${dots}: huruf apa?`, answer: letter, difficulty });
        break;
      }
      case "dictation-numbers": {
        const num = numbers[i % numbers.length];
        exercises.push({ id: `dn-${i}`, question: num, answer: num, difficulty });
        break;
      }
    }
  }
  return exercises;
}

export default function PracticeClient({ gradeLevel, role }: PracticeClientProps) {
  const isStudent = role === "student";

  // State
  const [mode, setMode] = useState<TeacherMode | StudentMode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentExercise = exercises[currentIndex];
  const progress = exercises.length > 0 ? ((currentIndex + 1) / exercises.length) * 100 : 0;
  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  const handleSpeak = async (text: string) => {
    if (isSpeaking) { stopSpeaking(); setIsSpeaking(false); return; }
    try {
      setIsSpeaking(true);
      await speak(text, { rate: 0.85, pitch: 1.0, volume: 1.0 });
      setIsSpeaking(false);
    } catch {
      toast.error("Tidak dapat memutar audio");
      setIsSpeaking(false);
    }
  };

  // Auto-speak untuk siswa
  useEffect(() => {
    if (isStudent && currentExercise && !showAnswer) {
      const timer = setTimeout(() => {
        if (mode === "guess-letter") {
          handleSpeak(`${currentExercise.question}. Ketik satu huruf.`);
        } else {
          handleSpeak(`Dengarkan dan ketik: ${currentExercise.question}`);
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, mode]);

  const startPractice = (m: TeacherMode | StudentMode, diff: Difficulty) => {
    stopSpeaking();
    setMode(m);
    setDifficulty(diff);
    const ex = isStudent
      ? generateStudentExercises(m as StudentMode, diff)
      : generateTeacherExercises(m as TeacherMode, diff);
    setExercises(ex);
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
    const answerClean = userAnswer.trim().toLowerCase();
    const correctClean = currentExercise.answer.toLowerCase();
    const isCorrect = answerClean === correctClean;

    setScore((prev) => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }));
    setStreak((prev) => (isCorrect ? prev + 1 : 0));

    if (isCorrect) {
      toast.success("Benar! 🎉");
      speak("Correct!", { rate: 1.0 });
      setTimeout(() => nextExercise(), 1200);
    } else {
      toast.error(`Belum tepat. Jawabannya: ${currentExercise.answer}`);
      speak(`Jawaban yang benar adalah: ${currentExercise.answer}`, { rate: 0.85 });
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
      const final = score.correct + 1;
      toast.success(`Latihan selesai! Skor: ${final}/${exercises.length}`);
      speak(`Latihan selesai! Skor: ${final} dari ${exercises.length} benar.`, { rate: 0.9 });
    }
  };

  const resetSession = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setMode(null);
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

  // ====== MENU PILIHAN ======
  if (!mode) {
    return (
      <div className="space-y-8">
        <div id="practice-header">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {isStudent ? "Latihan Dengar & Jawab" : "Latihan Braille"}
          </h1>
          <p className="text-muted-foreground">
            {isStudent
              ? "Dengarkan soal dan ketik jawaban. Tanpa perlu melihat layar."
              : "Pilih jenis dan tingkat kesulitan latihan untuk memulai."}
          </p>
        </div>

        {isStudent && (
          <Card className="border-primary bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Headphones className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Mode Audio — Tanpa Layar</p>
                  <p className="text-sm text-muted-foreground">
                    Semua soal akan dibacakan. Kamu hanya perlu mendengar dan mengetik jawaban. Tidak ada konten visual.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!isStudent && (
          <Card id="accessibility-notice" className="border-primary bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Volume2 className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="font-medium">Mode Dengar Tersedia</p>
                  <p className="text-sm text-muted-foreground">
                    Aktifkan Mode Dengar di header latihan untuk membacakan soal secara otomatis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div id="practice-types" className="grid gap-6 md:grid-cols-3">
          {isStudent ? (
            <>
              {/* Mode Siswa: Dengar & Ketik */}
              <ModeCard
                icon={Ear}
                title="Dengar & Ketik"
                desc="Dengarkan kata dalam Bahasa Inggris, lalu ketik teksnya."
                buttons={[
                  { label: "Mudah — Kata Pendek", onClick: () => startPractice("listen-type", "easy") },
                  { label: "Sedang — Kata Menengah", onClick: () => startPractice("listen-type", "medium") },
                  { label: "Sulit — Kata Panjang", onClick: () => startPractice("listen-type", "hard") },
                ]}
              />
              {/* Mode Siswa: Tebak Huruf */}
              <ModeCard
                icon={Hash}
                title="Tebak Huruf dari Titik"
                desc="Dengarkan deskripsi titik Braille, tebak hurufnya. Contoh: 'titik 1, 2, dan 5 membentuk huruf apa?'"
                buttons={[
                  { label: "Mudah — A-J", onClick: () => startPractice("guess-letter", "easy") },
                ]}
              />
              {/* Mode Siswa: Dikte Angka */}
              <ModeCard
                icon={Volume2}
                title="Dikte Angka"
                desc="Dengarkan angka dalam Bahasa Inggris, lalu ketik teksnya."
                buttons={[
                  { label: "Angka 1-10", onClick: () => startPractice("dictation-numbers", "easy") },
                ]}
              />
            </>
          ) : (
            <>
              <ModeCard
                icon={BookOpen}
                title="Flashcards"
                desc="Tinjau karakter Braille dengan kartu interaktif"
                buttons={[
                  { label: "Mudah — Huruf", onClick: () => startPractice("flashcard", "easy") },
                  { label: "Sedang — Kata 3 Huruf", onClick: () => startPractice("flashcard", "medium") },
                  { label: "Sulit — Kata 5 Huruf", onClick: () => startPractice("flashcard", "hard") },
                ]}
              />
              <ModeCard
                icon={Zap}
                title="Braille → Teks"
                desc="Baca Braille dan ketik teks menggunakan keyboard biasa"
                buttons={[
                  { label: "Mudah — Huruf", onClick: () => startPractice("braille-to-text", "easy") },
                  { label: "Sedang — Kata 3 Huruf", onClick: () => startPractice("braille-to-text", "medium") },
                  { label: "Sulit — Kata 5 Huruf", onClick: () => startPractice("braille-to-text", "hard") },
                ]}
              />
              <ModeCard
                icon={Award}
                title="Teks → Braille"
                desc="Konversi teks ke Braille (3 mode input tersedia)"
                buttons={[
                  { label: "Mudah — Huruf", onClick: () => startPractice("text-to-braille", "easy") },
                  { label: "Sedang — Kata 3 Huruf", onClick: () => startPractice("text-to-braille", "medium") },
                  { label: "Sulit — Kata 5 Huruf", onClick: () => startPractice("text-to-braille", "hard") },
                ]}
              />
            </>
          )}
        </div>

        <TutorialDriver steps={practiceSteps} storageKey="bralingo-tutorial-practice" />
      </div>
    );
  }

  // ====== COMPLETE ======
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
              <StatBox value={`${accuracy}%`} label="Akurasi" />
              <StatBox value={`${score.correct}/${score.total}`} label="Jawaban Benar" />
              <StatBox value={`${streak}`} label="Streak Terbaik" />
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={resetSession} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" /> Kembali ke Menu
              </Button>
              <Button onClick={() => startPractice(mode!, difficulty)}>Coba Lagi</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ====== SESSION AKTIF ======
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {mode === "listen-type" && "Dengar & Ketik"}
            {mode === "guess-letter" && "Tebak Huruf dari Titik"}
            {mode === "dictation-numbers" && "Dikte Angka"}
            {mode === "flashcard" && "Latihan Flashcard"}
            {mode === "braille-to-text" && "Braille → Teks"}
            {mode === "text-to-braille" && "Teks → Braille"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {difficulty === "easy" ? "Mudah" : difficulty === "medium" ? "Sedang" : "Sulit"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline">{currentIndex + 1}/{exercises.length}</Badge>
          {score.total > 0 && <Badge variant="secondary">{accuracy}%</Badge>}
          {streak > 0 && <Badge>🔥 {streak}</Badge>}
        </div>
      </div>

      <div role="region" aria-label="Progress latihan" className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="sr-only">Progress: {Math.round(progress)}% selesai</p>
      </div>

      {/* Siswa: tampilan audio-only */}
      {isStudent && currentExercise && (
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="text-center space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSpeak(currentExercise.question)}
                aria-label={isSpeaking ? "Hentikan audio" : "Dengarkan soal lagi"}
              >
                {isSpeaking ? <VolumeX className="h-4 w-4 mr-2" aria-hidden="true" /> : <Volume2 className="h-4 w-4 mr-2" aria-hidden="true" />}
                {isSpeaking ? "Stop" : "Dengarkan Lagi"}
              </Button>
            </div>

            <div className="space-y-3">
              <label htmlFor="student-answer" className="text-sm font-medium text-foreground">
                Ketik jawaban kamu:
              </label>
              <Input
                id="student-answer"
                placeholder="Ketik di sini..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={showAnswer}
                className="text-lg text-center"
                autoFocus
                aria-label="Jawaban kamu"
              />

              {showAnswer && (
                <div className="p-4 bg-destructive/10 rounded-lg text-center" role="alert">
                  <p className="text-sm text-muted-foreground mb-1">Jawaban yang benar:</p>
                  <p className="text-2xl font-bold text-foreground">{currentExercise.answer}</p>
                </div>
              )}

              <div className="flex justify-center gap-4">
                {!showAnswer ? (
                  <Button onClick={checkAnswer} size="lg" disabled={!userAnswer.trim()}>
                    Periksa Jawaban
                  </Button>
                ) : (
                  <Button onClick={nextExercise} size="lg">
                    Soal Selanjutnya
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Guru: tetap pakai tampilan visual existing */}
      {!isStudent && currentExercise && <TeacherExerciseView
        currentExercise={currentExercise}
        userAnswer={userAnswer}
        setUserAnswer={setUserAnswer}
        showAnswer={showAnswer}
        isSpeaking={isSpeaking}
        handleSpeak={handleSpeak}
        handleKeyPress={handleKeyPress}
        checkAnswer={checkAnswer}
        nextExercise={nextExercise}
        setShowAnswer={setShowAnswer}
      />}

      <div className="flex justify-between items-center">
        <Button onClick={resetSession} variant="ghost">
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" /> Keluar Latihan
        </Button>
        <div role="status" aria-live="polite" className="text-sm text-muted-foreground">
          Skor: {score.correct}/{score.total}
        </div>
      </div>
    </div>
  );
}

// ====== Sub-components ======

function ModeCard({ icon: Icon, title, desc, buttons }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  buttons: { label: string; onClick: () => void }[];
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {buttons.map((b) => (
          <Button key={b.label} onClick={b.onClick} className="w-full" variant="outline">
            {b.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-4 bg-muted rounded-lg">
      <div className="text-3xl font-bold text-primary">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function TeacherExerciseView({ currentExercise, userAnswer, setUserAnswer, showAnswer, isSpeaking, handleSpeak, handleKeyPress, checkAnswer, nextExercise, setShowAnswer }: {
  currentExercise: Exercise;
  userAnswer: string;
  setUserAnswer: (v: string) => void;
  showAnswer: boolean;
  isSpeaking: boolean;
  handleSpeak: (text: string) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  checkAnswer: () => void;
  nextExercise: () => void;
  setShowAnswer: (v: boolean) => void;
}) {
  const mode = (() => {
    if (currentExercise.id.startsWith("f-")) return "flashcard";
    if (currentExercise.id.startsWith("b2t-")) return "braille-to-text";
    return "text-to-braille";
  })();

  if (mode === "flashcard") {
    return (
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="min-h-[250px] flex items-center justify-center bg-muted rounded-lg cursor-pointer"
            onClick={() => setShowAnswer(!showAnswer)} role="button" tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setShowAnswer(!showAnswer)}
            aria-label={showAnswer ? "Sembunyikan jawaban" : "Tampilkan jawaban"}>
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold" aria-hidden={showAnswer}>
                {showAnswer ? currentExercise.answer : currentExercise.question}
              </div>
              {showAnswer && currentExercise.braille && (
                <p className="text-sm font-medium text-foreground">{brailleStringToDescription(currentExercise.braille)}</p>
              )}
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleSpeak(currentExercise.question); }}
                aria-label="Dengarkan flashcard">
                <Volume2 className="h-4 w-4 mr-2" aria-hidden="true" /> Dengarkan
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <Button onClick={nextExercise} size="lg">Kartu Selanjutnya</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="text-center space-y-4">
          <label className="text-sm font-medium">
            {mode === "braille-to-text" ? "Apa artinya ini?" : "Konversi kata ini ke Braille:"}
          </label>
          <div className="text-5xl font-bold min-h-[120px] flex items-center justify-center bg-muted rounded-lg"
            role="img" aria-label={mode === "braille-to-text" ? `Braille: ${currentExercise.question}` : currentExercise.question}>
            {currentExercise.question}
          </div>
          <Button variant="ghost" size="sm" onClick={() => handleSpeak(mode === "braille-to-text" ? currentExercise.question : currentExercise.question)}
            aria-label="Dengarkan">
            <Volume2 className="h-4 w-4 mr-2" aria-hidden="true" /> Dengarkan
          </Button>
        </div>

        <div className="space-y-3">
          <Input placeholder="Ketik jawaban kamu..." value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)} onKeyDown={handleKeyPress}
            disabled={showAnswer} className="text-lg text-center" autoFocus aria-label="Jawaban kamu" />

          {showAnswer && (
            <div className="p-4 bg-destructive/10 rounded-lg text-center" role="alert">
              <p className="text-sm text-muted-foreground mb-1">Jawaban yang benar:</p>
              <p className="text-2xl font-bold">{currentExercise.answer}</p>
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
      </CardContent>
    </Card>
  );
}
