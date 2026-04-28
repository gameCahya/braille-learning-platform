// app/(dashboard)/settings/_actions/profile-actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const validated = profileSchema.safeParse({
    full_name: formData.get("full_name"),
    avatar_url: formData.get("avatar_url"),
  });

  if (!validated.success) {
    return { success: false, error: validated.error.message };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: validated.data.full_name,
      avatar_url: validated.data.avatar_url || null,
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
