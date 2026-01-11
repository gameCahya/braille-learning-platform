"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AccessibleBrailleInput } from "@/components/braille/AccessibleBrailleInput";
import { textToBraille } from "@/lib/braille";
import { speak, stopSpeaking } from "@/lib/speech";
import { BookOpen, Zap, Award, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

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

// Generate exercises based on type and difficulty
function generateExercises(type: ExerciseType, difficulty: Difficulty, count: number = 10): Exercise[] {
  const exercises: Exercise[] = [];

  // Word pools based on difficulty
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
        exercises.push({
          id: `flash-${i}`,
          type: "flashcard",
          question: word,
          answer: braille,
          braille,
          difficulty
        });
        break;

      case "braille-to-text":
        exercises.push({
          id: `b2t-${i}`,
          type: "braille-to-text",
          question: braille,
          answer: word.toLowerCase(),
          braille,
          difficulty
        });
        break;

      case "text-to-braille":
        exercises.push({
          id: `t2b-${i}`,
          type: "text-to-braille",
          question: word,
          answer: braille,
          braille,
          difficulty
        });
        break;
    }
  }

  return exercises;
}

export default function PracticePage() {
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

  const currentExercise = exercises[currentIndex];
  const progress = exercises.length > 0 ? ((currentIndex + 1) / exercises.length) * 100 : 0;
  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  // Improved text-to-speech function
  const handleSpeak = async (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);
      await speak(text, {
        rate: 0.85,
        pitch: 1.0,
        volume: 1.0
      });
      setIsSpeaking(false);
    } catch (error) {
      console.error("Speech error:", error);
      toast.error("Could not play audio");
      setIsSpeaking(false);
    }
  };

  // Start practice session
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

  // Check answer
  const checkAnswer = () => {
    if (!currentExercise || !userAnswer.trim()) return;

    const isCorrect = userAnswer.trim().toLowerCase() === currentExercise.answer.toLowerCase();

    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    setStreak((prev) => (isCorrect ? prev + 1 : 0));

    if (isCorrect) {
      toast.success("Correct! Great job! 🎉");
      speak("Correct!", { rate: 1.0 });
      setTimeout(() => {
        nextExercise();
      }, 1500);
    } else {
      toast.error(`Incorrect. The answer is: ${currentExercise.answer}`);
      speak(`Incorrect. The correct answer is ${currentExercise.answer}`, { rate: 0.9 });
      setShowAnswer(true);
    }
  };

  // Next exercise
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
      toast.success(`Practice complete! Final score: ${finalScore}/${exercises.length}`);
      speak(`Practice complete! You got ${finalScore} out of ${exercises.length} correct.`, { rate: 0.9 });
    }
  };

  // Flip flashcard
  const flipCard = () => {
    const newShowAnswer = !showAnswer;
    setShowAnswer(newShowAnswer);
    if (newShowAnswer) {
      handleSpeak(currentExercise.answer);
    } else {
      handleSpeak(currentExercise.question);
    }
  };

  // Reset session
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

  // Handle Enter key for regular input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !showAnswer) {
      checkAnswer();
    }
  };

  // No exercise type selected - show selection screen
  if (!exerciseType) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Practice Braille</h1>
          <p className="text-muted-foreground">
            Choose an exercise type and difficulty to start practicing.
          </p>
        </div>

        {/* Accessibility Notice */}
        <Card className="border-primary bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Volume2 className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-2">
                <p className="font-medium">♿ Accessible for All Users</p>
                <p className="text-sm text-muted-foreground">
                  This platform supports <strong>Audio Mode</strong> for screen reader users, 
                  <strong> Text Mode</strong> for easy input, and <strong>Visual Keyboard</strong> for 
                  interactive learning. Choose the mode that works best for you!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Types */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Flashcards</CardTitle>
              </div>
              <CardDescription>
                Review Braille characters with interactive flashcards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => startPractice("flashcard", "easy")}
                className="w-full"
                variant="outline"
              >
                Easy - Letters
              </Button>
              <Button
                onClick={() => startPractice("flashcard", "medium")}
                className="w-full"
                variant="outline"
              >
                Medium - 3-Letter Words
              </Button>
              <Button
                onClick={() => startPractice("flashcard", "hard")}
                className="w-full"
                variant="outline"
              >
                Hard - 5-Letter Words
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Braille → Text</CardTitle>
              </div>
              <CardDescription>
                Read Braille and type the text using regular keyboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => startPractice("braille-to-text", "easy")}
                className="w-full"
                variant="outline"
              >
                Easy - Letters
              </Button>
              <Button
                onClick={() => startPractice("braille-to-text", "medium")}
                className="w-full"
                variant="outline"
              >
                Medium - 3-Letter Words
              </Button>
              <Button
                onClick={() => startPractice("braille-to-text", "hard")}
                className="w-full"
                variant="outline"
              >
                Hard - 5-Letter Words
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-primary">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Text → Braille</CardTitle>
              </div>
              <CardDescription>
                Convert text to Braille (3 input modes available)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => startPractice("text-to-braille", "easy")}
                className="w-full"
                variant="outline"
              >
                Easy - Letters
              </Button>
              <Button
                onClick={() => startPractice("text-to-braille", "medium")}
                className="w-full"
                variant="outline"
              >
                Medium - 3-Letter Words
              </Button>
              <Button
                onClick={() => startPractice("text-to-braille", "hard")}
                className="w-full"
                variant="outline"
              >
                Hard - 5-Letter Words
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Exercise session complete
  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Practice Complete! 🎉</CardTitle>
            <CardDescription className="text-center">
              Great work! Here&apos;s how you did:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold text-primary">{accuracy}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {score.correct}/{score.total}
                </div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold text-primary">{streak}</div>
                <div className="text-sm text-muted-foreground">Best Streak</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={resetSession} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                Back to Menu
              </Button>
              <Button onClick={() => startPractice(exerciseType, difficulty)}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active exercise session
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {exerciseType === "flashcard" && "Flashcard Practice"}
            {exerciseType === "braille-to-text" && "Braille → Text"}
            {exerciseType === "text-to-braille" && "Text → Braille"}
          </h1>
          <p className="text-sm text-muted-foreground capitalize">{difficulty} level</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            {currentIndex + 1} / {exercises.length}
          </Badge>
          <Badge variant="secondary" className="text-sm">
            {accuracy}% Accuracy
          </Badge>
          {streak > 0 && (
            <Badge className="text-sm">🔥 {streak} Streak</Badge>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2" role="region" aria-label="Progress">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground text-right sr-only">
          Progress: {Math.round(progress)}% complete
        </p>
      </div>

      {/* Exercise card */}
      <Card>
        <CardContent className="pt-6">
          {currentExercise && (
            <>
              {/* Flashcard type */}
              {currentExercise.type === "flashcard" && (
                <div className="space-y-6">
                  <div
                    className="min-h-[300px] flex items-center justify-center bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={flipCard}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && flipCard()}
                    aria-label={showAnswer ? "Hide answer. Press Enter to flip" : "Show answer. Press Enter to flip"}
                  >
                    <div className="text-center space-y-4">
                      <div className="text-6xl font-bold">
                        {showAnswer ? currentExercise.answer : currentExercise.question}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(showAnswer ? currentExercise.answer : currentExercise.question);
                        }}
                        aria-label={isSpeaking ? "Stop audio" : "Listen to flashcard"}
                      >
                        {isSpeaking ? (
                          <VolumeX className="h-4 w-4 mr-2" />
                        ) : (
                          <Volume2 className="h-4 w-4 mr-2" />
                        )}
                        {isSpeaking ? "Stop" : "Listen"}
                      </Button>
                    </div>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    Click card or press Enter to flip
                  </div>
                  <div className="flex justify-center">
                    <Button onClick={nextExercise} size="lg">
                      Next Card
                    </Button>
                  </div>
                </div>
              )}

              {/* Braille to Text type */}
              {currentExercise.type === "braille-to-text" && (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <label className="text-sm font-medium">What does this say?</label>
                    <div 
                      className="text-6xl font-bold min-h-[200px] flex items-center justify-center bg-muted rounded-lg"
                      role="img"
                      aria-label={`Braille characters: ${currentExercise.question}`}
                    >
                      {currentExercise.question as React.ReactNode}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSpeak(currentExercise.answer)}
                      aria-label="Listen to the answer"
                    >
                      {isSpeaking ? (
                        <VolumeX className="h-4 w-4 mr-2" />
                      ) : (
                        <Volume2 className="h-4 w-4 mr-2" />
                      )}
                      {isSpeaking ? "Stop" : "Listen to Answer"}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Input
                      placeholder="Type your answer..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={handleKeyPress}
                      disabled={showAnswer}
                      className="text-lg text-center"
                      autoFocus
                      aria-label="Your answer"
                      aria-describedby={showAnswer ? "answer-feedback" : undefined}
                    />

                    {showAnswer && (
                      <div 
                        id="answer-feedback"
                        className="p-4 bg-destructive/10 rounded-lg text-center"
                        role="alert"
                      >
                        <p className="text-sm text-muted-foreground mb-2">Correct answer:</p>
                        <p className="text-2xl font-bold">{currentExercise.answer}</p>
                      </div>
                    )}

                    <div className="flex justify-center gap-4">
                      {!showAnswer ? (
                        <Button onClick={checkAnswer} size="lg" disabled={!userAnswer.trim()}>
                          Check Answer
                        </Button>
                      ) : (
                        <Button onClick={nextExercise} size="lg">
                          Next Question
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Text to Braille type - USE ACCESSIBLE INPUT */}
              {currentExercise.type === "text-to-braille" && (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <label className="text-lg font-medium">
                      Convert this word to Braille:
                    </label>
                    <div className="text-5xl font-bold min-h-[120px] flex items-center justify-center bg-muted rounded-lg">
                      {currentExercise.question}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSpeak(currentExercise.question)}
                      aria-label="Listen to the word"
                    >
                      {isSpeaking ? (
                        <VolumeX className="h-4 w-4 mr-2" />
                      ) : (
                        <Volume2 className="h-4 w-4 mr-2" />
                      )}
                      {isSpeaking ? "Stop" : "Listen"}
                    </Button>
                  </div>

                  {/* ACCESSIBLE BRAILLE INPUT COMPONENT */}
                  <AccessibleBrailleInput
                    value={userAnswer}
                    onChange={setUserAnswer}
                    targetWord={currentExercise.question}
                    onSubmit={checkAnswer}
                    disabled={showAnswer}
                  />

                  {showAnswer && (
                    <div 
                      className="p-4 bg-destructive/10 rounded-lg text-center"
                      role="alert"
                    >
                      <p className="text-sm text-muted-foreground mb-2">Correct answer:</p>
                      <p className="text-4xl font-bold">{currentExercise.answer}</p>
                    </div>
                  )}

                  {showAnswer && (
                    <div className="flex justify-center">
                      <Button onClick={nextExercise} size="lg">
                        Next Question
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Bottom actions */}
      <div className="flex justify-between items-center">
        <Button onClick={resetSession} variant="ghost">
          <RotateCcw className="mr-2 h-4 w-4" />
          Exit Practice
        </Button>
        <div 
          className="text-sm text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          Score: {score.correct} / {score.total}
        </div>
      </div>
    </div>
  );
}