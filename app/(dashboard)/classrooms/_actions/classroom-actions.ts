"use server";

// app/(dashboard)/classrooms/_actions/classroom-actions.ts
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const classroomSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  description: z.string().optional(),
});

export async function createClassroom(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const validated = classroomSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!validated.success) {
    return { success: false, error: validated.error.message };
  }

  const { error } = await supabase.from("classrooms").insert(
    {
      teacher_id: user.id,
      name: validated.data.name,
      description: validated.data.description || null,
    },
    { returning: "minimal" }
  );

  if (error) {
    console.error("Create classroom error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/classrooms");
  return { success: true };
}

export async function updateClassroom(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const validated = classroomSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!validated.success) {
    return { success: false, error: validated.error.message };
  }

  const { error } = await supabase
    .from("classrooms")
    .update(
      {
        name: validated.data.name,
        description: validated.data.description || null,
        updated_at: new Date().toISOString(),
      },
      { returning: "minimal" }
    )
    .eq("id", id)
    .eq("teacher_id", user.id);

  if (error) {
    console.error("Update classroom error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/classrooms");
  return { success: true };
}

export async function deleteClassroom(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("classrooms")
    .delete({ returning: "minimal" })
    .eq("id", id)
    .eq("teacher_id", user.id);

  if (error) {
    console.error("Delete classroom error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/classrooms");
  return { success: true };
}
