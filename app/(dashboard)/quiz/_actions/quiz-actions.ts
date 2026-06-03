"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { TeacherQuizQuestion } from "@/types";
import type { Json } from "@/types/supabase";

const questionSchema = z.object({
  id: z.number(),
  question: z.string().min(1, "Soal wajib diisi"),
  options: z
    .array(z.string().min(1, "Opsi tidak boleh kosong"))
    .min(2, "Minimal 2 opsi jawaban"),
  answer: z.string().min(1, "Jawaban wajib dipilih"),
});

const quizSchema = z.object({
  title: z.string().min(1, "Judul quiz wajib diisi"),
  description: z.string().optional(),
  topic: z.string().min(1, "Topik wajib diisi"),
  is_published: z.boolean().default(false),
  questions: z.array(questionSchema).min(1, "Minimal satu soal"),
});

export async function createTeacherQuiz(data: {
  title: string;
  description?: string;
  topic: string;
  is_published: boolean;
  questions: TeacherQuizQuestion[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Tidak diizinkan. Silakan login." };

  const validated = quizSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message ?? "Data tidak valid",
    };
  }

  const { error } = await supabase.from("teacher_quizzes").insert({
    teacher_id: user.id,
    title: validated.data.title,
    description: validated.data.description || null,
    topic: validated.data.topic,
    is_published: validated.data.is_published,
    questions: validated.data.questions as unknown as Json,
  });

  if (error) {
    console.error("Create quiz error:", error);
    return { success: false, error: "Gagal membuat quiz. Silakan coba lagi." };
  }

  revalidatePath("/quiz");
  return { success: true };
}

export async function updateTeacherQuiz(
  id: string,
  data: {
    title: string;
    description?: string;
    topic: string;
    is_published: boolean;
    questions: TeacherQuizQuestion[];
  }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Tidak diizinkan. Silakan login." };

  const validated = quizSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message ?? "Data tidak valid",
    };
  }

  const { error } = await supabase
    .from("teacher_quizzes")
    .update({
      title: validated.data.title,
      description: validated.data.description || null,
      topic: validated.data.topic,
      is_published: validated.data.is_published,
      questions: validated.data.questions as unknown as Json,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("teacher_id", user.id);

  if (error) {
    console.error("Update quiz error:", error);
    return { success: false, error: "Gagal mengupdate quiz. Silakan coba lagi." };
  }

  revalidatePath("/quiz");
  revalidatePath(`/quiz/${id}`);
  return { success: true };
}

export async function deleteTeacherQuiz(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Tidak diizinkan. Silakan login." };

  const { error } = await supabase
    .from("teacher_quizzes")
    .delete()
    .eq("id", id)
    .eq("teacher_id", user.id);

  if (error) {
    console.error("Delete quiz error:", error);
    return { success: false, error: "Gagal menghapus quiz." };
  }

  revalidatePath("/quiz");
  return { success: true };
}
