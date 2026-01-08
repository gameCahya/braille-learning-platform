"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { Exercise } from "@/types";
import { textToBraille, brailleToText } from "@/lib/braille";

interface QuizComponentProps {
  exercises: Exercise[];
  onComplete: (score: number, answers: Record<string, string>) => void;
}

export default function QuizComponent({ exercises, onComplete }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = exercises[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exercises.length) * 100;

  const handleSubmitAnswer = () => {
    let userAnswer = selectedAnswer.trim();
    let correctAnswer = currentQuestion.correctAnswer;

    // Normalize answers based on question type
    if (currentQuestion.type === "text-to-braille") {
      userAnswer = textToBraille(userAnswer);
      // Remove spaces for comparison
      userAnswer = userAnswer.replace(/\s/g, "");
      correctAnswer = correctAnswer.replace(/\s/g, "");
    } else if (currentQuestion.type === "braille-to-text") {
      userAnswer = userAnswer.toLowerCase().trim();
      correctAnswer = correctAnswer.toLowerCase().trim();
    }

    const correct = userAnswer === correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    // Save answer
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: selectedAnswer,
    }));
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer("");
    
    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed
      const score = calculateScore();
      setQuizCompleted(true);
      onComplete(score, answers);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    
    exercises.forEach((exercise) => {
      const userAnswer = answers[exercise.id]?.trim() || "";
      let correct = false;

      if (exercise.type === "multiple-choice") {
        correct = userAnswer === exercise.correctAnswer;
      } else if (exercise.type === "text-to-braille") {
        const userBraille = textToBraille(userAnswer).replace(/\s/g, "");
        const correctBraille = exercise.correctAnswer.replace(/\s/g, "");
        correct = userBraille === correctBraille;
      } else if (exercise.type === "braille-to-text") {
        correct = userAnswer.toLowerCase() === exercise.correctAnswer.toLowerCase();
      }

      if (correct) correctCount++;
    });

    return Math.round((correctCount / exercises.length) * 100);
  };

  if (quizCompleted) {
    const score = calculateScore();
    const passed = score >= 70;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {passed ? "🎉 Congratulations!" : "Keep Practicing!"}
          </CardTitle>
          <CardDescription className="text-center">
            You &apos;ve completed the quiz
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">
              {score}%
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Your score
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Correct answers</span>
              <span className="font-medium">
                {Math.round((score / 100) * exercises.length)} / {exercises.length}
              </span>
            </div>
            <Progress value={score} />
          </div>

          {passed ? (
            <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-300">
                Great job! You&apos;ve passed this quiz. Keep up the good work!
              </p>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                You need 70% or higher to pass. Review the lessons and try again!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                Question {currentQuestionIndex + 1} of {exercises.length}
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} />
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">
              {currentQuestion.type.replace("-", " ")}
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {currentQuestion.points} points
            </Badge>
          </div>
          <CardTitle className="text-xl mt-4">
            {currentQuestion.question}
          </CardTitle>
          {currentQuestion.hint && !showFeedback && (
            <CardDescription>
              <AlertCircle className="inline h-4 w-4 mr-1" />
              Hint: {currentQuestion.hint}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Multiple Choice */}
          {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
            <div className="space-y-2">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedAnswer(option)}
                  disabled={showFeedback}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    selectedAnswer === option
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  } ${showFeedback ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-mono">{option}</span>
                    {showFeedback && option === currentQuestion.correctAnswer && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    {showFeedback &&
                      option === selectedAnswer &&
                      option !== currentQuestion.correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Text Input (for text-to-braille and braille-to-text) */}
          {(currentQuestion.type === "text-to-braille" ||
            currentQuestion.type === "braille-to-text") && (
            <div className="space-y-2">
              <Label htmlFor="answer">Your answer</Label>
              <Input
                id="answer"
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                placeholder={
                  currentQuestion.type === "text-to-braille"
                    ? "Type your answer in text"
                    : "Type your answer"
                }
                disabled={showFeedback}
                className={
                  currentQuestion.type === "braille-to-text"
                    ? "text-2xl font-mono"
                    : ""
                }
              />
            </div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div
              className={`p-4 rounded-lg border-2 ${
                isCorrect
                  ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
              }`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      isCorrect
                        ? "text-green-800 dark:text-green-300"
                        : "text-red-800 dark:text-red-300"
                    }`}
                  >
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </p>
                  {!isCorrect && (
                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                      The correct answer is:{" "}
                      <span className="font-mono font-semibold">
                        {currentQuestion.correctAnswer}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            {!showFeedback ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer.trim()}
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                {currentQuestionIndex < exercises.length - 1
                  ? "Next Question"
                  : "Finish Quiz"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}