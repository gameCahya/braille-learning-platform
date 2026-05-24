"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().min(1, "Nama lengkap wajib diisi"),
  school_name: z.string().min(1, "Nama sekolah wajib diisi"),
});

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const validated = profileSchema.safeParse({
    full_name: formData.get("full_name"),
    school_name: formData.get("school_name"),
  });

  if (!validated.success) {
    return { success: false, error: validated.error.message };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: validated.data.full_name,
      school_name: validated.data.school_name,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Update profile error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/settings");
  return { success: true };
}
