"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const studentSchema = z.object({
  full_name: z.string().min(1, "Nama lengkap wajib diisi"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  classroom_id: z.string().uuid().optional().nullable(),
  notes: z.string().optional(),
});

export async function createStudent(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Tidak diizinkan. Silakan login." };
  }

  const validated = studentSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    classroom_id: formData.get("classroom_id") || null,
    notes: formData.get("notes"),
  });

  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message ?? "Data tidak valid" };
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
    return { success: false, error: "Gagal menambah siswa. Silakan coba lagi." };
  }

  revalidatePath("/students");
  return { success: true };
}

export async function updateStudent(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Tidak diizinkan. Silakan login." };
  }

  const validated = studentSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    classroom_id: formData.get("classroom_id") || null,
    notes: formData.get("notes"),
  });

  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message ?? "Data tidak valid" };
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
    return { success: false, error: "Gagal memperbarui siswa. Silakan coba lagi." };
  }

  revalidatePath("/students");
  revalidatePath(`/students/${id}`);
  return { success: true };
}

const studentWithAuthSchema = z.object({
  full_name: z.string().min(1, "Nama lengkap wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  classroom_id: z.string().uuid().optional().nullable(),
  notes: z.string().optional(),
});

export async function createStudentWithAuth(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Tidak diizinkan. Silakan login." };

  const validated = studentWithAuthSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    classroom_id: formData.get("classroom_id") || null,
    notes: formData.get("notes"),
  });
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const { full_name, email, password, classroom_id, notes } = validated.data;
  const adminClient = createAdminClient();

  try {
    // Step 1: Buat auth user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, role: "student" },
    });

    if (authError) {
      if (authError.status === 422 || authError.message?.includes("already exists")) {
        return { success: false, error: `Email ${email} sudah terdaftar. Gunakan email lain.` };
      }
      return { success: false, error: authError.message };
    }
    if (!authData.user) return { success: false, error: "Gagal membuat akun." };

    const authUserId = authData.user.id;

    // Step 2: Insert profile (pakai adminClient — bypass RLS, trigger juga sudah fire)
    const { error: profileError } = await adminClient.from("profiles").upsert({
      id: authUserId,
      email,
      full_name,
      role: "student",
      status: "approved",
      school_name: null,
      grade_level: null,
    }, { onConflict: "id" });

    if (profileError) {
      await adminClient.auth.admin.deleteUser(authUserId).catch(console.error);
      return { success: false, error: "Gagal mengatur profil siswa." };
    }

    // Step 3: Insert students (pakai supabase biasa — teacher punya akses ke students miliknya)
    const { error: studentError } = await supabase.from("students").insert({
      teacher_id: user.id,
      full_name,
      email,
      auth_user_id: authUserId,
      classroom_id: classroom_id || null,
      notes: notes || null,
      has_login: true,
    });

    if (studentError) {
      await adminClient.from("profiles").delete().eq("id", authUserId);
      await adminClient.auth.admin.deleteUser(authUserId).catch(console.error);
      return { success: false, error: "Gagal menambah data siswa." };
    }

    revalidatePath("/students");
    return { success: true };
  } catch (error) {
    console.error("createStudentWithAuth error:", error);
    return { success: false, error: "Terjadi kesalahan tak terduga." };
  }
}

export async function createAuthForExistingStudent(
  studentId: string,
  email: string,
  password: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Tidak diizinkan." };

  const { data: student } = await supabase
    .from("students")
    .select("id, full_name, has_login, auth_user_id")
    .eq("id", studentId)
    .eq("teacher_id", user.id)
    .single();

  if (!student) return { success: false, error: "Siswa tidak ditemukan." };
  if (student.has_login) return { success: false, error: "Siswa sudah memiliki akun login." };

  const adminClient = createAdminClient();

  try {
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { full_name: student.full_name, role: "student" },
    });
    if (authError) {
      if (authError.status === 422 || authError.message?.includes("already exists")) {
        return { success: false, error: `Email ${email} sudah terdaftar.` };
      }
      return { success: false, error: authError.message };
    }
    const authUserId = authData.user!.id;

    // Upsert profile (pakai adminClient — bypass RLS)
    const { error: profileError } = await adminClient.from("profiles").upsert({
      id: authUserId, email, full_name: student.full_name,
      role: "student", status: "approved",
    }, { onConflict: "id" });

    if (profileError) {
      await adminClient.auth.admin.deleteUser(authUserId).catch(console.error);
      return { success: false, error: "Gagal mengatur profil." };
    }

    // Update students
    const { error: updateError } = await supabase
      .from("students")
      .update({ email, has_login: true, auth_user_id: authUserId })
      .eq("id", studentId);

    if (updateError) {
      await adminClient.from("profiles").delete().eq("id", authUserId);
      await adminClient.auth.admin.deleteUser(authUserId).catch(console.error);
      return { success: false, error: "Gagal memperbarui data siswa." };
    }

    revalidatePath("/students");
    return { success: true };
  } catch (error) {
    console.error("createAuthForExistingStudent error:", error);
    return { success: false, error: "Terjadi kesalahan." };
  }
}

export async function deleteStudent(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Tidak diizinkan. Silakan login." };

  const { data: student } = await supabase
    .from("students")
    .select("full_name, has_login, auth_user_id")
    .eq("id", id)
    .eq("teacher_id", user.id)
    .single();

  if (!student) return { success: false, error: "Siswa tidak ditemukan." };

  // Jika punya akun, hapus profile + auth user (manual, tidak ada CASCADE)
  if (student.has_login && student.auth_user_id) {
    const adminClient = createAdminClient();

    try {
      // Hapus profile dulu (pakai adminClient — bypass RLS)
      const { error: profileDeleteError } = await adminClient
        .from("profiles")
        .delete()
        .eq("id", student.auth_user_id);

      if (profileDeleteError) {
        console.error("Failed to delete profile:", profileDeleteError);
        return { success: false, error: "Gagal menghapus profil. Silakan coba lagi." };
      }

      // Hapus auth user
      const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(student.auth_user_id);

      if (authDeleteError) {
        console.error("Failed to delete auth user:", authDeleteError);
        return { success: false, error: "Gagal menghapus akun login. Silakan coba lagi." };
      }
    } catch (error) {
      console.error("Delete auth user error:", error);
      return { success: false, error: "Gagal menghapus akun. Silakan coba lagi." };
    }
  }

  // Hapus dari tabel students
  const { error: studentDeleteError } = await supabase
    .from("students")
    .delete()
    .eq("id", id)
    .eq("teacher_id", user.id);

  if (studentDeleteError) {
    console.error("Delete student error:", studentDeleteError);
    return { success: false, error: "Gagal menghapus siswa." };
  }

  revalidatePath("/students");
  return { success: true };
}
