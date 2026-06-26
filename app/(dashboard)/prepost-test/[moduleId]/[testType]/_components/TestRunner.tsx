"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { submitPrePostTest } from "@/app/(dashboard)/prepost-test/_actions/submit-test";
import type { PrePostTestData } from "@/types";

interface TestRunnerProps {
  testData: PrePostTestData;
  testType: "pre" | "post";
  studentId: string;
  teacherId: string;
}

export function TestRunner({ testData, testType, studentId, teacherId }: TestRunnerProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const questions = testData.questions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  const userAnswer = answers[currentQuestion.id] ?? "";

  const handleAnswerChange = useCallback(
    (value: string) => {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    },
    [currentQuestion.id]
  );

  const handlePrev = useCallback(() => {
    if (!isFirst) setCurrentIndex((i) => i - 1);
  }, [isFirst]);

  const handleNext = useCallback(() => {
    if (!isLast) setCurrentIndex((i) => i + 1);
  }, [isLast]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Build PrePostAnswer array
    const answerPayload = questions.map((q) => ({
      questionId: q.id,
      question: q.question,
      questionType: q.type as "mcq" | "essay",
      userAnswer: answers[q.id] ?? null,
      correctAnswer: q.answer,
      isCorrect: null,
    }));

    const result = await submitPrePostTest({
      studentId,
      teacherId,
      moduleId: testData.moduleId,
      testType,
      answers: answerPayload,
    });

    setIsSubmitting(false);

    if (result.success) {
      startTransition(() => {
        router.push(
          `/prepost-test/${testData.moduleId}/results?studentId=${studentId}`
        );
      });
    } else {
      setSubmitError(result.error ?? "Gagal mengumpulkan jawaban.");
    }
  }, [questions, answers, studentId, teacherId, testData.moduleId, testType, router]);

  // ── MCQ select handler ──
  const handleMcqSelect = useCallback(
    (option: string) => {
      handleAnswerChange(option);
    },
    [handleAnswerChange]
  );

  return (
    <div className="space-y-6">
      {/* Header info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {testType === "pre" ? "Pre-Test" : "Post-Test"}
          </h1>
          <p className="text-sm text-muted-foreground">{testData.moduleTitle}</p>
        </div>
        <span className="text-sm text-muted-foreground">
          Soal {currentIndex + 1} dari {totalQuestions}
        </span>
      </div>

      {/* Progress bar */}
      <Progress
        value={progressPercent}
        aria-label={`Progress: ${currentIndex + 1} dari ${totalQuestions} soal`}
        className="h-2"
      />

      {/* Soal nomor navigasi (dots) */}
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Daftar soal">
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined && answers[q.id] !== "";
          const isActive = idx === currentIndex;
          return (
            <button
              key={q.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Soal nomor ${idx + 1}${isAnswered ? " (sudah dijawab)" : ""}`}
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-all border-2 ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : isAnswered
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-muted-foreground/30 bg-muted text-muted-foreground"
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      <Card className="min-h-[280px] flex flex-col">
        <CardContent className="flex-1 flex flex-col p-6 md:p-8 gap-6">
          {/* Question text */}
          <p className="text-lg md:text-xl font-semibold text-foreground leading-snug">
            {currentQuestion.question}
          </p>

          {/* MCQ options */}
          {currentQuestion.type === "mcq" && currentQuestion.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              {currentQuestion.options.map((option) => {
                const isSelected = userAnswer === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleMcqSelect(option)}
                    className={`rounded-xl border-2 px-4 py-3 text-base font-medium text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted/50 text-foreground hover:border-muted-foreground/50"
                    }`}
                    aria-pressed={isSelected}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {/* Essay textarea */}
          {currentQuestion.type === "essay" && (
            <div className="flex-1 flex flex-col gap-2">
              <label
                htmlFor={`essay-${currentQuestion.id}`}
                className="text-sm font-medium text-muted-foreground"
              >
                Tulis jawaban Anda:
              </label>
              <textarea
                id={`essay-${currentQuestion.id}`}
                value={userAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Ketik jawaban disini..."
                rows={4}
                className="flex-1 resize-none rounded-xl border-2 border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error message */}
      {submitError && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {submitError}
        </div>
      )}

      {/* Navigation & Submit */}
      <div className="flex items-center justify-between gap-3">
        {/* Prev button */}
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={isFirst}
          aria-label="Soal sebelumnya"
        >
          <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
          Sebelumnya
        </Button>

        {/* Next or Submit */}
        {isLast ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={isSubmitting}
                aria-label="Kumpulkan jawaban"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="h-4 w-4 mr-1" aria-hidden="true" />
                )}
                {isSubmitting ? "Mengumpulkan..." : "Kumpulkan"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Kumpulkan {testType === "pre" ? "Pre-Test" : "Post-Test"}?</AlertDialogTitle>
                <AlertDialogDescription>
                  Pastikan semua jawaban sudah diisi. Anda tidak dapat mengubah jawaban setelah dikumpulkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" aria-hidden="true" />
                      Mengumpulkan...
                    </>
                  ) : (
                    "Ya, kumpulkan"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button
            onClick={handleNext}
            disabled={isLast}
            aria-label="Soal selanjutnya"
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
