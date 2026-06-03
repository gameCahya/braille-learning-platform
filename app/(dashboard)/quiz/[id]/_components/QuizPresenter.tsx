"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff, RotateCcw } from "lucide-react";
import { Quiz } from "@/lib/data/quiz";
import { cn } from "@/lib/utils";

export function QuizPresenter({ quiz }: { quiz: Quiz }) {
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const question = quiz.questions[current];
  const isFirst = current === 0;
  const isLast = current === quiz.questions.length - 1;
  const progressPercent = ((current + 1) / quiz.questions.length) * 100;

  const next = () => {
    setShowAnswer(false);
    setCurrent((c) => c + 1);
  };

  const prev = () => {
    setShowAnswer(false);
    setCurrent((c) => c - 1);
  };

  const reset = () => {
    setShowAnswer(false);
    setCurrent(0);
  };

  return (
    <div className="space-y-6">

      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Soal {current + 1} dari {quiz.questions.length}</span>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          aria-label="Mulai ulang quiz dari awal"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Mulai ulang
        </button>
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuenow={Math.round(progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${current + 1} dari ${quiz.questions.length} soal`}
        className="w-full bg-muted rounded-full h-2"
      >
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-card border rounded-2xl p-6 md:p-10 space-y-6 min-h-[280px] flex flex-col justify-between">
        <p className="text-xl md:text-2xl font-semibold text-foreground leading-snug">
          {question.question}
        </p>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((option) => {
            const isAnswer = option === question.answer;
            const revealed = showAnswer && isAnswer;
            return (
              <div
                key={option}
                role="listitem"
                className={cn(
                  "rounded-xl border-2 px-4 py-3 text-base font-medium transition-all",
                  revealed
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted/50 text-foreground"
                )}
                aria-label={revealed ? `Jawaban: ${option}` : option}
              >
                {option}
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3">
        {/* Prev */}
        <div className="tactile-wrapper">
          <button
            onClick={prev}
            disabled={isFirst}
            aria-label="Soal sebelumnya"
            className="flex items-center gap-2 bg-muted text-foreground font-bold text-sm py-2.5 px-5 rounded-xl border-b-4 border-border hover:brightness-95 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-4"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Sebelumnya
          </button>
        </div>

        {/* Show/hide answer */}
        <div className="tactile-wrapper">
          <button
            onClick={() => setShowAnswer((v) => !v)}
            aria-label={showAnswer ? "Sembunyikan jawaban" : "Tampilkan jawaban"}
            className="flex items-center gap-2 bg-secondary text-secondary-foreground font-bold text-sm py-2.5 px-5 rounded-xl border-b-4 border-secondary/60 hover:brightness-105 active:border-b-0 active:translate-y-1 transition-all"
          >
            {showAnswer ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            {showAnswer ? "Sembunyikan" : "Jawaban"}
          </button>
        </div>

        {/* Next */}
        <div className="tactile-wrapper">
          <button
            onClick={next}
            disabled={isLast}
            aria-label="Soal selanjutnya"
            className="flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm py-2.5 px-5 rounded-xl border-b-4 border-secondary hover:brightness-105 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-4"
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Done state */}
      {isLast && showAnswer && (
        <div className="text-center py-4 bg-primary/10 border border-primary/20 rounded-xl" role="status">
          <p className="font-semibold text-primary">
            <span aria-hidden="true">🎉 </span>
            Quiz selesai!
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Semua soal telah ditampilkan.
          </p>
        </div>
      )}
    </div>
  );
}
