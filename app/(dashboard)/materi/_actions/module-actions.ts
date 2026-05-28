"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { TeacherModuleLesson } from "@/types";

const lessonSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Judul pelajaran wajib diisi"),
  content: z.string().min(1, "Konten pelajaran wajib diisi"),
  braille: z.string().optional(),
});

const moduleSchema = z.object({
  title: z.string().min(1, "Judul modul wajib diisi"),
  description: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  is_published: z.boolean().default(false),
  lessons: z.array(lessonSchema).min(1, "Minimal satu pelajaran"),
});

export async function createTeacherModule(data: {
  title: string;
  description?: string;
  difficulty: string;
  is_published: boolean;
  lessons: TeacherModuleLesson[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const validated = moduleSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message };
  }

  const { data: existing } = await supabase
    .from("teacher_modules")
    .select("order_number")
    .eq("teacher_id", user.id)
    .order("order_number", { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (existing?.order_number ?? 0) + 1;

  const { error } = await supabase.from("teacher_modules").insert({
    teacher_id: user.id,
    title: validated.data.title,
    description: validated.data.description || null,
    difficulty: validated.data.difficulty,
    is_published: validated.data.is_published,
    lessons: validated.data.lessons,
    order_number: nextOrder,
  });

  if (error) {
    console.error("Create module error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/materi");
  return { success: true };
}

export async function updateTeacherModule(
  id: string,
  data: {
    title: string;
    description?: string;
    difficulty: string;
    is_published: boolean;
    lessons: TeacherModuleLesson[];
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const validated = moduleSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message };
  }

  const { error } = await supabase
    .from("teacher_modules")
    .update({
      title: validated.data.title,
      description: validated.data.description || null,
      difficulty: validated.data.difficulty,
      is_published: validated.data.is_published,
      lessons: validated.data.lessons,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("teacher_id", user.id);

  if (error) {
    console.error("Update module error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/materi");
  revalidatePath(`/materi/${id}`);
  return { success: true };
}

export async function deleteTeacherModule(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase
    .from("teacher_modules")
    .delete()
    .eq("id", id)
    .eq("teacher_id", user.id);

  if (error) {
    console.error("Delete module error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/materi");
  return { success: true };
}

export async function togglePublishModule(id: string, is_published: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase
    .from("teacher_modules")
    .update({ is_published, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("teacher_id", user.id);

  if (error) {
    console.error("Toggle publish error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/materi");
  return { success: true };
}
