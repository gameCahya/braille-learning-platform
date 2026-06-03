"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createTeacherQuiz, updateTeacherQuiz } from "../_actions/quiz-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, ChevronLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import type { TeacherQuiz } from "@/types";

const formSchema = z.object({
  title: z.string().min(1, "Judul quiz wajib diisi"),
  description: z.string().optional(),
  topic: z.string().min(1, "Topik wajib diisi"),
  is_published: z.boolean(),
  questions: z
    .array(
      z.object({
        id: z.number(),
        question: z.string().min(1, "Soal wajib diisi"),
        options: z
          .array(z.string().min(1, "Opsi tidak boleh kosong"))
          .min(2, "Minimal 2 opsi"),
        answer: z.string().min(1, "Jawaban wajib dipilih"),
      })
    )
    .min(1, "Minimal satu soal"),
});

type FormValues = z.infer<typeof formSchema>;

interface QuizFormProps {
  quiz?: TeacherQuiz;
}

function createEmptyQuestion(index: number) {
  return {
    id: Date.now() + index,
    question: "",
    options: ["", "", "", ""],
    answer: "",
  };
}

export function QuizForm({ quiz }: QuizFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const isEdit = !!quiz;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: quiz
      ? {
          title: quiz.title,
          description: quiz.description ?? "",
          topic: quiz.topic,
          is_published: quiz.is_published,
          questions: quiz.questions,
        }
      : {
          title: "",
          description: "",
          topic: "Umum",
          is_published: false,
          questions: [createEmptyQuestion(0)],
        },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const questions = watch("questions");

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      if (isEdit && quiz) {
        const result = await updateTeacherQuiz(quiz.id, data);
        if (result?.error) {
          toast.error("Gagal mengupdate quiz", { description: result.error });
          setIsSubmitting(false);
          return;
        }
        toast.success("Quiz berhasil diupdate!");
        router.push(`/quiz/${quiz.id}`);
      } else {
        const result = await createTeacherQuiz(data);
        if (result?.error) {
          toast.error("Gagal membuat quiz", { description: result.error });
          setIsSubmitting(false);
          return;
        }
        toast.success("Quiz berhasil dibuat!");
        router.push("/quiz");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan", { description: "Coba lagi nanti." });
      setIsSubmitting(false);
    }
  };

  const addQuestion = () => {
    append(createEmptyQuestion(fields.length));
    // Info untuk screen reader
    toast.info(`Soal ke-${fields.length + 1} ditambahkan`);
  };

  const removeQuestion = (index: number) => {
    if (fields.length <= 1) return;
    remove(index);
    toast.info(`Soal ke-${index + 1} dihapus`);
  };

  const inputClass =
    "w-full bg-muted border-2 border-border rounded-xl px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-colors";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* Back button */}
      <Link
        href="/quiz"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Kembali ke Quiz
      </Link>

      {/* ============ Informasi Quiz ============ */}
      <fieldset className="border-0 p-0 space-y-4">
        <legend className="text-lg font-bold text-foreground">
          {isEdit ? "Edit Quiz" : "Buat Quiz Baru"}
        </legend>

        {/* Judul */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="quiz-title" className="text-sm font-medium text-foreground">
            Judul Quiz <span className="text-destructive" aria-label="wajib diisi">*</span>
          </label>
          <input
            id="quiz-title"
            type="text"
            placeholder="Contoh: Kuis Huruf Braille Dasar"
            className={inputClass}
            aria-required="true"
            aria-invalid={errors.title ? "true" : "false"}
            aria-describedby={errors.title ? "quiz-title-error" : undefined}
            {...register("title")}
          />
          {errors.title && (
            <p id="quiz-title-error" className="text-sm text-destructive" role="alert">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Deskripsi */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="quiz-desc" className="text-sm font-medium text-foreground">
            Deskripsi <span className="text-muted-foreground text-xs">(opsional)</span>
          </label>
          <Textarea
            id="quiz-desc"
            placeholder="Deskripsi singkat tentang quiz ini..."
            className={`${inputClass} min-h-[80px]`}
            {...register("description")}
          />
        </div>

        {/* Topik */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="quiz-topic" className="text-sm font-medium text-foreground">
            Topik <span className="text-destructive" aria-label="wajib diisi">*</span>
          </label>
          <input
            id="quiz-topic"
            type="text"
            placeholder="Contoh: Alfabet, Angka, Kosakata"
            className={inputClass}
            aria-required="true"
            aria-invalid={errors.topic ? "true" : "false"}
            aria-describedby={errors.topic ? "quiz-topic-error" : undefined}
            {...register("topic")}
          />
          {errors.topic && (
            <p id="quiz-topic-error" className="text-sm text-destructive" role="alert">
              {errors.topic.message}
            </p>
          )}
        </div>

        {/* Published toggle */}
        <div className="flex items-center gap-3">
          <Switch
            id="quiz-published"
            checked={watch("is_published")}
            onCheckedChange={(v) => setValue("is_published", v)}
            aria-label="Publikasikan quiz"
          />
          <label htmlFor="quiz-published" className="text-sm text-foreground cursor-pointer select-none">
            Publikasikan quiz
          </label>
          <span className="text-xs text-muted-foreground">
            {watch("is_published") ? "Siswa dapat mengakses quiz ini" : "Quiz hanya terlihat oleh guru (draft)"}
          </span>
        </div>
      </fieldset>

      {/* ============ Soal-soal ============ */}
      <fieldset className="border-0 p-0 space-y-6">
        <legend className="text-lg font-bold text-foreground mb-2">
          Daftar Soal
        </legend>

        {errors.questions && !Array.isArray(errors.questions) && (
          <p className="text-sm text-destructive" role="alert">
            {errors.questions.message}
          </p>
        )}

        {fields.map((field, qIndex) => (
          <div
            key={field.id}
            className="bg-muted/30 border rounded-2xl p-5 space-y-4"
            role="region"
            aria-label={`Soal ke-${qIndex + 1}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">
                Soal {qIndex + 1}
              </h3>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeQuestion(qIndex)}
                  aria-label={`Hapus soal ke-${qIndex + 1}`}
                >
                  <Trash2 className="h-4 w-4 mr-1" aria-hidden="true" />
                  Hapus
                </Button>
              )}
            </div>

            {/* Pertanyaan */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`q-${qIndex}-question`}
                className="text-sm font-medium text-foreground"
              >
                Pertanyaan <span className="text-destructive" aria-label="wajib diisi">*</span>
              </label>
              <Textarea
                id={`q-${qIndex}-question`}
                placeholder="Tulis pertanyaan di sini..."
                className={`${inputClass} min-h-[80px]`}
                aria-required="true"
                aria-invalid={errors.questions?.[qIndex]?.question ? "true" : "false"}
                aria-describedby={
                  errors.questions?.[qIndex]?.question
                    ? `q-${qIndex}-question-error`
                    : undefined
                }
                {...register(`questions.${qIndex}.question`)}
              />
              {errors.questions?.[qIndex]?.question && (
                <p
                  id={`q-${qIndex}-question-error`}
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {errors.questions[qIndex].question.message}
                </p>
              )}
            </div>

            {/* Opsi Jawaban */}
            <fieldset className="border-0 p-0 space-y-3">
              <legend className="text-sm font-medium text-foreground mb-1">
                Opsi Jawaban <span className="text-destructive" aria-label="wajib diisi">*</span>
              </legend>

              {questions[qIndex]?.options.map((_, oIndex) => (
                <div key={oIndex} className="flex items-center gap-3">
                  {/* Radio untuk jawaban benar */}
                  <input
                    type="radio"
                    id={`q-${qIndex}-answer-${oIndex}`}
                    name={`q-${qIndex}-correct`}
                    value={questions[qIndex]?.options[oIndex] || ""}
                    checked={questions[qIndex]?.answer === questions[qIndex]?.options[oIndex]}
                    onChange={() =>
                      setValue(
                        `questions.${qIndex}.answer`,
                        questions[qIndex]?.options[oIndex] || ""
                      )
                    }
                    className="h-4 w-4 accent-primary shrink-0"
                    aria-label={`Jadikan opsi ${oIndex + 1} sebagai jawaban benar`}
                  />

                  {/* Input opsi */}
                  <div className="flex-1 flex flex-col gap-1">
                    <label
                      htmlFor={`q-${qIndex}-opt-${oIndex}`}
                      className="sr-only"
                    >
                      Opsi {oIndex + 1}
                    </label>
                    <input
                      id={`q-${qIndex}-opt-${oIndex}`}
                      type="text"
                      placeholder={`Opsi ${oIndex + 1}`}
                      className={inputClass}
                      aria-required={oIndex < 2 ? "true" : "false"}
                      aria-label={`Opsi jawaban ${oIndex + 1}`}
                      {...register(`questions.${qIndex}.options.${oIndex}`)}
                    />
                  </div>
                </div>
              ))}

              {errors.questions?.[qIndex]?.options && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.questions[qIndex].options.message ??
                    errors.questions[qIndex].options.root?.message}
                </p>
              )}
              {errors.questions?.[qIndex]?.answer && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.questions[qIndex].answer.message}
                </p>
              )}
            </fieldset>
          </div>
        ))}

        {/* Tombol Tambah Soal */}
        <Button
          type="button"
          variant="outline"
          onClick={addQuestion}
          className="w-full border-dashed"
          aria-label="Tambah soal baru"
        >
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Tambah Soal
        </Button>
      </fieldset>

      {/* ============ Submit ============ */}
      <div className="tactile-wrapper w-full">
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="w-full bg-primary text-primary-foreground font-bold text-base py-3 px-6 rounded-xl border-b-4 border-secondary hover:brightness-105 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-4"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="inline h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
              {isEdit ? "Mengupdate..." : "Membuat..."}
            </>
          ) : isEdit ? (
            "Simpan Perubahan"
          ) : (
            "Buat Quiz"
          )}
        </button>
      </div>

      {/* Screen reader feedback */}
      <div aria-live="polite" className="sr-only" aria-atomic="true">
        {isSubmitting ? "Menyimpan quiz, harap tunggu" : ""}
      </div>
    </form>
  );
}
