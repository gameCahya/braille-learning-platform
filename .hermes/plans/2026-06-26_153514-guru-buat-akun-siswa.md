# Guru Membuat Akun Siswa — Implementation Plan (v2)

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Guru bisa menambahkan siswa sekaligus membuat akun login untuk mereka (email + password), sehingga siswa bisa login ke platform sendiri — dengan alur approval yang jelas.

**Architecture:**
- Gunakan Supabase Auth Admin API (`supabase.auth.admin.createUser()`) via service_role key
- Simpan `auth_user_id` di tabel `students` untuk relasi langsung → no more `listUsers()` lookup
- Insert profile langsung di server action (jangan andalkan trigger timing yang tidak pasti)
- Hapus profile manual saat delete user (tidak ada CASCADE dari auth.users)
- Auto-approve: teacher-created accounts langsung `status='approved'` karena guru sudah terverifikasi

**Approval Flow Analysis:**
- **Siswa daftar sendiri** via `/register` → status='pending' → admin approve → bisa login ✅
- **Guru daftar sendiri** via `/register` → status='pending' → admin approve → bisa login ✅
- **Guru buat akun siswa** → langsung `status='approved'` → siswa langsung bisa login ✅
  - Rasional: guru sudah terverifikasi oleh admin. Guru adalah "delegated authority" untuk siswa di kelasnya.
  - Tidak perlu admin approval lagi karena siswa ini sudah dalam pengawasan guru.
  - Jika guru menyalahgunakan (daftarkan siswa palsu), admin bisa hapus dari panel admin.
- **Guru daftar via admin** (future) → langsung approved, sama seperti case di atas.

**Tech Stack:** Next.js 16, Supabase Auth Admin API, shadcn/ui, Zod

---

## Dokumen Referensi

- `students` table: id, teacher_id, full_name, email (optional), classroom_id, notes, created_at, updated_at
- `profiles` table: id (FK → auth.users.id), email, full_name, role, school_name, grade_level, status (pending/approved/rejected)
- Trigger `handle_new_user()`: otomatis insert profile dari `raw_user_meta_data`
- `app/(dashboard)/students/_actions/student-actions.ts` — existing CRUD (tanpa auth)
- `app/(dashboard)/students/_components/StudentForm.tsx` — existing form (tanpa password)
- `app/(dashboard)/students/_components/StudentsTable.tsx` — existing table

**Current flow:** Guru tambah siswa hanya di tabel `students` tanpa akun login. Siswa harus daftar sendiri via `/register` lalu tunggu admin approve.

**New flow (guru buat akun):**
```
Guru buka /students/new
  → isi nama, email, password
  → centang "Buatkan akun login"
  → submit
Server action:
  1. auth.admin.createUser({ email, password, email_confirm: true })
  2. Insert profile (id, email, full_name, role='student', status='approved')
  3. Insert students (teacher_id, full_name, email, auth_user_id, has_login=true)
  → Selesai. Siswa langsung bisa login.
```

---

## Perbaikan dari Review

| Poin | Masalah | Solusi |
|------|---------|--------|
| 1 | `listUsers()` tidak scalable untuk cari auth user | Simpan `auth_user_id` di students → langsung `admin.deleteUser(authUserId)` |
| 2 | Trigger timing: profile mungkin belum ada saat update | Insert profile langsung di server action, tidak andalkan trigger |
| 3 | Email sudah terdaftar: error tidak jelas | Catch `user_already_exists`, beri pesan jelas di UI |
| 4 | Delete: hapus auth gagal → orphan user | Jika hapus auth gagal → batalkan delete siswa |
| 5 | Pagination di listUsers() | Tidak dipakai lagi karena pakai auth_user_id |
| 6 | CASCADE terbalik: profiles → auth.users | Hapus profile manual: `profiles.delete().eq("id", authUserId)` |
| 7 | createAuthForExistingStudent: no rollback | Tambah rollback jika update gagal |
| 8 | Import path | Pastikan admin client hanya di server action |

---

## Task 1: Migration — Tambah Kolom

**Objective:** Tambah kolom `has_login`, `auth_user_id` di tabel `students`.

**Files:**
- Create: `supabase/migrations/20260626000001_add_student_login.sql`

**Isi migration:**

```sql
-- Tambah kolom tracking akun di students
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS has_login boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS auth_user_id uuid;

-- Foreign key ke auth.users (optional — Supabase tidak selalu izinkan FK ke auth schema)
-- Tapi kita simpan ID-nya untuk lookup langsung tanpa listUsers()
-- Index untuk lookup cepat
CREATE INDEX IF NOT EXISTS idx_students_auth_user_id ON public.students (auth_user_id);
```

**Catatan:** `auth_user_id` tidak dibuat `NOT NULL` karena siswa existing tidak punya. Index memastikan lookup cepat saat delete.

**Verifikasi:**
1. Migration jalan tanpa error
2. Kolom `has_login` + `auth_user_id` ada

---

## Task 2: Service Role Supabase Client

**Objective:** Buat Supabase client dengan service_role key hanya untuk server-side.

**Files:**
- Create: `lib/supabase/admin.ts`

```ts
// lib/supabase/admin.ts
// ⚠️ HANYA untuk server-side (server actions, route handlers)
// JANGAN di-import di client components!
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Supabase admin credentials not configured')
  }

  return createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
```

**Setup:** Tambahkan `SUPABASE_SERVICE_ROLE_KEY` ke `.env.local` (ambil dari Supabase Dashboard → Settings → API → `service_role key`).

**Verifikasi:**
1. File kompilasi tanpa error
2. Bisa di-import di server action

---

## Task 3: Server Action — Create Student + Auth Account

**Objective:** Buat server action `createStudentWithAuth` yang membuat auth user + profile + students dalam satu transaksi logis.

**Files:**
- Modify: `app/(dashboard)/students/_actions/student-actions.ts`

```ts
"use server";

import { createAdminClient } from "@/lib/supabase/admin";

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
    // Step 1: Buat auth user — langsung verified (email_confirm: true)
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, role: "student" },
    });

    if (authError) {
      // Tangkap error email sudah terdaftar dengan pesan jelas
      if (authError.status === 422 || authError.message?.includes("already exists")) {
        return { success: false, error: `Email ${email} sudah terdaftar. Gunakan email lain.` };
      }
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: "Gagal membuat akun. Silakan coba lagi." };
    }

    const authUserId = authData.user.id;

    // Step 2: Insert profile (upsert — aman jika trigger handle_new_user() juga fire)
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: authUserId,
      email,
      full_name,
      role: "student",
      status: "approved",   // ✅ Auto-approved karena guru sudah verified
      school_name: null,
      grade_level: null,
    }, { onConflict: "id" });

    if (profileError) {
      // Rollback: hapus auth user
      await adminClient.auth.admin.deleteUser(authUserId).catch(console.error);
      return { success: false, error: "Gagal mengatur profil siswa." };
    }

    // Step 3: Insert students record
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
      // Rollback: hapus auth user + profile
      await supabase.from("profiles").delete().eq("id", authUserId).catch(console.error);
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
```

**Catatan penting:**
- `createAdminClient()` hanya dipanggil di dalam server action (server-side)
- Import `createAdminClient` hanya di file `.ts` server action, bukan di `.tsx` client
- Setiap error step → rollback penuh: hapus auth user + profile

**Verifikasi:**
1. Server action compile tanpa error
2. Test: submit form → cek auth.users + profiles (role=student, status=approved) + students (has_login=true, auth_user_id=uuid)
3. Test: email sudah terdaftar → error "Email ... sudah terdaftar"
4. Test: insert students gagal → auth user juga terhapus

---

## Task 4: Server Action — Buat Akun untuk Siswa Existing

**Objective:** Untuk siswa di tabel students yang belum punya akun, guru bisa buatkan akun.

**Files:**
- Modify: `app/(dashboard)/students/_actions/student-actions.ts`

```ts
export async function createAuthForExistingStudent(
  studentId: string,
  email: string,
  password: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Tidak diizinkan." };

  // Validasi: student milik guru ini
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
    // Step 1: Buat auth user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: student.full_name, role: "student" },
    });

    if (authError) {
      if (authError.status === 422 || authError.message?.includes("already exists")) {
        return { success: false, error: `Email ${email} sudah terdaftar.` };
      }
      return { success: false, error: authError.message };
    }

    const authUserId = authData.user!.id;

    // Step 2: Insert profile (upsert — aman jika trigger juga fire)
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: authUserId,
      email,
      full_name: student.full_name,
      role: "student",
      status: "approved",
    }, { onConflict: "id" });

    if (profileError) {
      // Rollback: hapus auth user
      await adminClient.auth.admin.deleteUser(authUserId).catch(console.error);
      return { success: false, error: "Gagal mengatur profil." };
    }

    // Step 3: Update students — link auth_user_id
    const { error: updateError } = await supabase
      .from("students")
      .update({ email, has_login: true, auth_user_id: authUserId })
      .eq("id", studentId);

    if (updateError) {
      // Rollback penuh
      await supabase.from("profiles").delete().eq("id", authUserId).catch(console.error);
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
```

**Verifikasi:**
1. Test: siswa tanpa akun → akun terbuat
2. Test: siswa sudah punya akun → error
3. Test: rollback jika update gagal

---

## Task 5: Update StudentForm — Checkbox + Password Fields

**Objective:** Tambah opsi "Buatkan akun login" di form tambah siswa.

**Files:**
- Modify: `app/(dashboard)/students/_components/StudentForm.tsx`

**Perubahan:**
1. Import `Checkbox` dari `@/components/ui/checkbox`
2. Import `createStudentWithAuth` dari actions
3. Tambah state `createAccount` (boolean)
4. Schema conditional dengan `superRefine`:

```tsx
const formSchema = z.object({
  create_account: z.boolean().default(false),
  full_name: z.string().min(1, "Nama lengkap wajib diisi"),
  email: z.string().optional().or(z.literal("")),
  password: z.string().optional(),
  confirm_password: z.string().optional(),
  classroom_id: z.string().optional(),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.create_account) {
    if (!data.email || data.email.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Email wajib diisi", path: ["email"] });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Format email tidak valid", path: ["email"] });
    }
    if (!data.password || data.password.length < 6) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Password minimal 6 karakter", path: ["password"] });
    }
    if (data.password !== data.confirm_password) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Password tidak cocok", path: ["confirm_password"] });
    }
  }
});
```

5. Checkbox di atas field kelas:

```tsx
<FormField
  control={form.control}
  name="create_account"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
          disabled={!!student} // Tidak bisa di edit mode
          aria-label="Buatkan akun login untuk siswa ini"
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>Buatkan akun login</FormLabel>
        <FormDescription>
          Siswa bisa login menggunakan email dan password
        </FormDescription>
      </div>
    </FormItem>
  )}
/>
```

6. Conditional fields (muncul jika `watch("create_account")` true):

```tsx
{watchCreateAccount && (
  <div className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
    <p className="text-sm font-medium text-primary flex items-center gap-2">
      <Info className="h-4 w-4" aria-hidden="true" />
      Detail Akun Login
    </p>
    <FormField ... email required />
    <FormField ... password />
    <FormField ... confirm_password />
  </div>
)}
```

7. Submit handler: pilih action berdasarkan `create_account`:

```tsx
async function onSubmit(values: FormValues) {
  setIsSubmitting(true);
  try {
    const formData = new FormData();
    formData.append("full_name", values.full_name);
    formData.append("email", values.create_account ? values.email || "" : (values.email || ""));
    formData.append("classroom_id", values.classroom_id || "");
    formData.append("notes", values.notes || "");

    let result;
    if (student) {
      result = await updateStudent(student.id, formData);
    } else if (values.create_account) {
      // New student with account
      formData.append("password", values.password || "");
      result = await createStudentWithAuth(formData);
    } else {
      // New student without account
      result = await createStudent(formData);
    }
    // ... toast + redirect
  }
}
```

**Verifikasi:**
1. Checkbox render, klik → field email+password muncul
2. Validasi: email+password required saat create_account=true
3. Submit dengan akun → panggil `createStudentWithAuth`
4. Submit tanpa akun → panggil `createStudent` (existing)
5. Mode edit: checkbox disabled
6. Tidak ada TypeScript error

---

## Task 6: Update StudentsTable — Kolom Status Akun + Dialog

**Objective:** Tambah kolom "Akun Login" dengan badge + tombol "Buatkan Akun" untuk siswa tanpa akun.

**Files:**
- Modify: `app/(dashboard)/students/_components/StudentsTable.tsx`
- Modify: `app/(dashboard)/students/page.tsx`

**Type update:**

```tsx
type StudentWithClassroom = {
  id: string;
  full_name: string;
  email: string | null;
  classroom_id: string | null;
  has_login: boolean;
  auth_user_id: string | null;  // baru
  classrooms: { name: string } | null;
};
```

**Kolom baru — setelah "Kelas", sebelum "Aksi":**

```tsx
{
  accessorKey: "has_login",
  header: "Akun Login",
  cell: ({ row }) => {
    const hasLogin = row.original.has_login;
    return hasLogin ? (
      <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
        <Check className="h-3 w-3 mr-1" aria-hidden="true" />
        Ada
      </Badge>
    ) : (
      <div className="flex items-center gap-1.5">
        <Badge variant="outline" className="text-muted-foreground">
          Tidak
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => openBuatAkunDialog(row.original)}
          aria-label={`Buatkan akun untuk ${row.original.full_name}`}
        >
          <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </div>
    );
  },
},
```

**BuatAkunDialog component — AlertDialog dengan form:**

```tsx
function BuatAkunDialog({
  student, open, onOpenChange, onSuccess,
}: {
  student: { id: string; full_name: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Validasi client-side
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email tidak valid"); return;
    }
    if (!password || password.length < 6) {
      setError("Password minimal 6 karakter"); return;
    }
    if (password !== confirmPassword) {
      setError("Password tidak cocok"); return;
    }

    setLoading(true);
    setError(null);
    const result = await createAuthForExistingStudent(student!.id, email, password);
    if (result.success) {
      toast.success(`Akun untuk ${student!.full_name} berhasil dibuat`);
      onOpenChange(false);
      onSuccess();
    } else {
      setError(result.error || "Gagal membuat akun");
    }
    setLoading(false);
  };

  if (!student) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Buat Akun Login</AlertDialogTitle>
          <AlertDialogDescription>
            Buatkan akun login untuk <strong>{student.full_name}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md" role="alert">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="dialog-email">Email</Label>
            <Input id="dialog-email" type="email" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="email@contoh.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dialog-password">Password</Label>
            <Input id="dialog-password" type="password" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="Minimal 6 karakter" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dialog-confirm">Konfirmasi Password</Label>
            <Input id="dialog-confirm" type="password" value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)} placeholder="Ketik ulang password" />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={loading || !email || !password}>
            {loading ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Membuat...</> : "Buat Akun"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

**Update students/page.tsx — tambah auth_user_id ke query:**

```tsx
const { data: students } = await supabase
  .from("students")
  .select(`
    id,
    full_name,
    email,
    classroom_id,
    has_login,
    auth_user_id,
    created_at,
    classrooms ( name )
  `)
  .in("classroom_id", classroomIds)
  .order("full_name");
```

**Verifikasi:**
1. Kolom "Akun Login" muncul dengan badge/tombol
2. Klik tombol "+" → dialog muncul
3. Dialog validasi client-side
4. Submit sukses → badge berubah jadi "Ada"
5. Import `Check, UserPlus, Loader2, Info` dari lucide-react
6. Import `Label` dari shadcn/ui
7. Tidak ada TypeScript error

---

## Task 7: Update Edit Student Page — Warning Email Read-Only

**Objective:** Jika siswa sudah punya akun, tampilkan warning bahwa email tidak bisa diubah.

**Files:**
- Modify: `app/(dashboard)/students/[id]/edit/page.tsx`
- Modify: `app/(dashboard)/students/_components/StudentForm.tsx`

**Di edit/page.tsx — tambah has_login ke query:**

```tsx
const { data: student } = await supabase
  .from("students")
  .select("id, full_name, email, classroom_id, notes, has_login, auth_user_id")
  .eq("id", id)
  .eq("teacher_id", user.id)
  .single();
```

**Pass ke StudentForm:**

```tsx
<StudentForm
  student={{
    id: student.id,
    full_name: student.full_name,
    email: student.email,
    classroom_id: student.classroom_id,
    notes: student.notes,
    has_login: student.has_login ?? false,
  }}
  classrooms={classrooms || []}
/>
```

**Di StudentForm — warning banner:**

```tsx
// Di bagian atas form (sebelum field-field):
{student?.has_login && (
  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
    <div className="flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" aria-hidden="true" />
      <div>
        <p className="font-medium">Akun login aktif</p>
        <p className="mt-1">
          Siswa ini sudah memiliki akun login. Email tidak bisa diubah melalui form ini.
          Untuk mengganti email akun, gunakan fitur pengaturan akun.
        </p>
      </div>
    </div>
  </div>
)}
```

**Di StudentForm — email read-only jika has_login:**

```tsx
<Input id="student-email" type="email" readOnly={student?.has_login}
  className={student?.has_login ? "bg-muted cursor-not-allowed" : ""}
  {...field}
/>
```

**Verifikasi:**
1. Warning banner muncul untuk siswa dengan akun
2. Field email greyed out + read-only
3. Nama, kelas, catatan tetap bisa diedit
4. Tidak ada TypeScript error

---

## Task 8: Update Delete Student — Hapus Auth + Profile Manual

**Objective:** Saat hapus siswa yang punya akun, hapus juga auth user + profile (manual, tidak ada CASCADE).

**Files:**
- Modify: `app/(dashboard)/students/_actions/student-actions.ts`

```ts
export async function deleteStudent(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Tidak diizinkan. Silakan login." };

  // Ambil data siswa (termasuk auth_user_id)
  const { data: student } = await supabase
    .from("students")
    .select("full_name, has_login, auth_user_id")
    .eq("id", id)
    .eq("teacher_id", user.id)
    .single();

  if (!student) return { success: false, error: "Siswa tidak ditemukan." };

  // Jika punya akun, hapus profile + auth user
  if (student.has_login && student.auth_user_id) {
    const adminClient = createAdminClient();

    try {
      // Hapus profile dulu (manual, karena tidak ada CASCADE dari auth.users)
      const { error: profileDeleteError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", student.auth_user_id);

      if (profileDeleteError) {
        console.error("Failed to delete profile:", profileDeleteError);
        return { success: false, error: "Gagal menghapus profil. Silakan coba lagi." };
      }

      // Hapus auth user
      const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(
        student.auth_user_id
      );

      if (authDeleteError) {
        console.error("Failed to delete auth user:", authDeleteError);
        return { success: false, error: "Gagal menghapus akun login. Silakan coba lagi." };
      }
    } catch (error) {
      console.error("Delete auth user error:", error);
      return { success: false, error: "Gagal menghapus akun. Silakan coba lagi." };
    }
  }

  // Hapus dari tabel students (akan cascade ke relasi lain)
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
```

**Alur delete:**
1. Cek auth_user_id
2. Hapus profile (manual) ← review point #6 fixed
3. Hapus auth user via admin API ← review point #1 fixed (langsung pakai auth_user_id)
4. Hapus students record
5. Jika step 2 atau 3 gagal → batalkan, return error ← review point #4 fixed

**Verifikasi:**
1. Hapus siswa tanpa akun → berjalan seperti biasa
2. Hapus siswa dengan akun → profile + auth user + students semua terhapus
3. Jika hapus profile/auth gagal → siswa tidak jadi dihapus (tidak ada orphan)
4. Tidak ada TypeScript error

---

## Task 9: Unit Tests

**Objective:** Tulis unit test untuk validasi schema conditional + skenario kritis.

**Files:**
- Create: `tests/unit/student-auth.test.ts`

```ts
import { describe, it, expect } from "vitest";

// Schema yang sama dengan StudentForm (copy di sini untuk test)
const formSchema = z.object({
  create_account: z.boolean().default(false),
  full_name: z.string().min(1, "Nama lengkap wajib diisi"),
  email: z.string().optional().or(z.literal("")),
  password: z.string().optional(),
  confirm_password: z.string().optional(),
  classroom_id: z.string().optional(),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.create_account) {
    if (!data.email || data.email.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Email wajib diisi", path: ["email"] });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Format email tidak valid", path: ["email"] });
    }
    if (!data.password || data.password.length < 6) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Password minimal 6 karakter", path: ["password"] });
    }
    if (data.password !== data.confirm_password) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Password tidak cocok", path: ["confirm_password"] });
    }
  }
});

describe("StudentForm schema — create_account=false (default)", () => {
  it("menerima data tanpa email dan password", () => {
    const r = formSchema.safeParse({ full_name: "Budi", create_account: false });
    expect(r.success).toBe(true);
  });

  it("menerima email opsional", () => {
    const r = formSchema.safeParse({ full_name: "Budi", create_account: false, email: "budi@mail.com" });
    expect(r.success).toBe(true);
  });
});

describe("StudentForm schema — create_account=true", () => {
  it("menolak tanpa email", () => {
    const r = formSchema.safeParse({ full_name: "Budi", create_account: true, password: "pass123", confirm_password: "pass123" });
    expect(r.success).toBe(false);
    expect(r.error!.issues.some(i => i.path.includes("email"))).toBe(true);
  });

  it("menolak email tidak valid", () => {
    const r = formSchema.safeParse({ full_name: "Budi", create_account: true, email: "bukan-email", password: "pass123", confirm_password: "pass123" });
    expect(r.success).toBe(false);
  });

  it("menolak password < 6 karakter", () => {
    const r = formSchema.safeParse({ full_name: "Budi", create_account: true, email: "budi@mail.com", password: "123", confirm_password: "123" });
    expect(r.success).toBe(false);
  });

  it("menolak confirm_password tidak cocok", () => {
    const r = formSchema.safeParse({ full_name: "Budi", create_account: true, email: "budi@mail.com", password: "pass123", confirm_password: "pass456" });
    expect(r.success).toBe(false);
  });

  it("menerima data valid", () => {
    const r = formSchema.safeParse({ full_name: "Budi", create_account: true, email: "budi@mail.com", password: "pass123", confirm_password: "pass123" });
    expect(r.success).toBe(true);
  });
});
```

**Verifikasi:**
1. `pnpm test` — semua test pass
2. Total test: minimal 10 untuk student-auth

---

## Ringkasan File

| Task | Action | File |
|------|--------|------|
| T1 | Create | `supabase/migrations/20260626000001_add_student_login.sql` |
| T2 | Create | `lib/supabase/admin.ts` |
| T3 | Modify | `app/(dashboard)/students/_actions/student-actions.ts` — tambah `createStudentWithAuth` |
| T4 | Modify | `app/(dashboard)/students/_actions/student-actions.ts` — tambah `createAuthForExistingStudent` |
| T5 | Modify | `app/(dashboard)/students/_components/StudentForm.tsx` — checkbox + password fields |
| T6 | Modify | `app/(dashboard)/students/_components/StudentsTable.tsx` — kolom akun + dialog |
| T6 | Modify | `app/(dashboard)/students/page.tsx` — tambah `auth_user_id, has_login` ke query |
| T7 | Modify | `app/(dashboard)/students/[id]/edit/page.tsx` — warning + email read-only |
| T7 | Modify | `app/(dashboard)/students/_components/StudentForm.tsx` — warning banner |
| T8 | Modify | `app/(dashboard)/students/_actions/student-actions.ts` — update `deleteStudent` |
| T9 | Create | `tests/unit/student-auth.test.ts` |

---

## Approval Flow Summary

```
Siapa daftar?          →  Status Awal     →  Siapa Approve?    →  Bisa Login?
─────────────────────────────────────────────────────────────────────────────
Siswa via /register    →  pending          →  Admin (panel)     →  Setelah approve
Guru via /register     →  pending          →  Admin (panel)     →  Setelah approve
Admin via seed/invite  →  approved         →  Auto              →  Langsung ✅
Guru buat akun siswa   →  approved         →  Auto (karena       →  Langsung ✅
                                               guru terverifikasi)
Siswa existing dapat
akun dari guru         →  approved         →  Auto              →  Langsung ✅
```

**Rasional auto-approve untuk teacher-created accounts:**
- Guru sudah melalui proses approval admin saat daftar
- Guru adalah delegated authority untuk siswa di kelasnya
- Admin tetap bisa hapus siswa (dan akunnya) dari panel jika ada penyalahgunaan
- Tidak perlu approval berlapis yang memperlambat proses belajar-mengajar

---

## Verification Checklist

- [ ] Migration: kolom `has_login` + `auth_user_id` di students
- [ ] Admin client: `createAdminClient()` hanya di server action
- [ ] Form: checkbox "Buatkan akun login" + conditional fields
- [ ] Validasi: create_account=true → email+password required
- [ ] Submit with auth → auth user + profile (role=student, status=approved) + students (has_login=true, auth_user_id)
- [ ] Submit without auth → createStudent existing (tanpa perubahan)
- [ ] Email sudah terdaftar → error jelas
- [ ] Rollback: jika gagal di step N → semua step sebelumnya di-revert
- [ ] Table: kolom "Akun Login" (Ada/Tidak) + tombol buat akun
- [ ] Dialog buat akun: validasi + submit + rollback
- [ ] Edit: warning banner + email read-only untuk siswa ber-akun
- [ ] Delete: profile manual → auth user → students (gagal di tengah → batalkan)
- [ ] Unit test passing (minimal 10 test)
- [ ] Build sukses
