"use server";

import { createClient } from "@/lib/supabase/server";
import { getModuleById } from "@/lib/data/modules";
import { revalidatePath } from "next/cache";
import type { TeacherModuleLesson } from "@/types";
import type { Json } from "@/types/supabase";

const GRADE_MAP: Record<number, string> = { 7: "VII", 8: "VIII", 9: "IX" };

function buildLessonContent(
  lesson: { content: string; description?: string; example?: string; words?: { indonesian: string; english: string; braille: string }[] }
): string {
  const parts: string[] = [lesson.content];
  if (lesson.description) parts.push(`Deskripsi: ${lesson.description}`);
  if (lesson.example) parts.push(`Contoh: ${lesson.example}`);
  if (lesson.words && lesson.words.length > 0) {
    const wordList = lesson.words
      .map((w) => `  - ${w.indonesian} = ${w.english} (${w.braille})`)
      .join("\n");
    parts.push(`Daftar Kosakata:\n${wordList}`);
  }
  return parts.join("\n\n");
}

export async function duplicateModule(moduleId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Silakan masuk terlebih dahulu" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "teacher") return { error: "Hanya guru yang bisa menduplikasi modul" };

  const mod = getModuleById(moduleId);
  if (!mod) return { error: "Modul tidak ditemukan" };

  const lessons: TeacherModuleLesson[] = mod.content.lessons.map((l) => ({
    id: crypto.randomUUID(),
    title: l.title,
    content: buildLessonContent(l),
    braille: l.braille,
  }));

  const { data: existing } = await supabase
    .from("teacher_modules")
    .select("order_number")
    .eq("teacher_id", user.id)
    .order("order_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (existing?.order_number ?? 0) + 1;

  const { data, error } = await supabase
    .from("teacher_modules")
    .insert({
      teacher_id: user.id,
      title: mod.title,
      description: mod.description,
      difficulty: mod.difficulty,
      target_grade: GRADE_MAP[mod.grade] ?? null,
      is_published: false,
      lessons: lessons as unknown as Json,
      order_number: nextOrder,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/materi");
  return { success: true, newId: data.id };
}
