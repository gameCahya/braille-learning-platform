// app/(dashboard)/students/_actions/student-actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const studentSchema = z.object({
  full_name: z.string().min(1, "Student name is required"),
  email: z.string().email().optional().or(z.literal("")),
  classroom_id: z.string().uuid().optional().nullable(),
  notes: z.string().optional(),
});

export async function createStudent(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const validated = studentSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    classroom_id: formData.get("classroom_id") || null,
    notes: formData.get("notes"),
  });

  if (!validated.success) {
    return { success: false, error: validated.error.message };
  }

  const { error } = await supabase.from("students").insert({
    teacher_id: user.id,
    full_name: validated.data.full_name,
    email: validated.data.email || null,
    classroom_id: validated.data.classroom_id || null,
    notes: validated.data.notes || null,
  });

  if (error) {
    console.error("Create student error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/students");
  return { success: true };
}

export async function updateStudent(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const validated = studentSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    classroom_id: formData.get("classroom_id") || null,
    notes: formData.get("notes"),
  });

  if (!validated.success) {
    return { success: false, error: validated.error.message };
  }

  const { error } = await supabase
    .from("students")
    .update({
      full_name: validated.data.full_name,
      email: validated.data.email || null,
      classroom_id: validated.data.classroom_id || null,
      notes: validated.data.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("teacher_id", user.id);

  if (error) {
    console.error("Update student error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/students");
  revalidatePath(`/students/${id}`);
  return { success: true };
}

export async function deleteStudent(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", id)
    .eq("teacher_id", user.id);

  if (error) {
    console.error("Delete student error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/students");
  return { success: true };
}
