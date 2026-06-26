"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createStudent, createStudentWithAuth, updateStudent } from "../_actions/student-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Info, AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

const formSchema = z
  .object({
    create_account: z.boolean().default(false),
    full_name: z.string().min(1, "Nama lengkap wajib diisi"),
    email: z.string().optional().or(z.literal("")),
    password: z.string().optional(),
    confirm_password: z.string().optional(),
    classroom_id: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.create_account) {
      if (!data.email || data.email.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email wajib diisi",
          path: ["email"],
        });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Format email tidak valid",
          path: ["email"],
        });
      }
      if (!data.password || data.password.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password minimal 6 karakter",
          path: ["password"],
        });
      }
      if (data.password !== data.confirm_password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password tidak cocok",
          path: ["confirm_password"],
        });
      }
    }
  });

type FormValues = z.input<typeof formSchema>;

interface Classroom {
  id: string;
  name: string;
}

interface StudentFormProps {
  student?: {
    id: string;
    full_name: string;
    email: string | null;
    classroom_id: string | null;
    notes: string | null;
    has_login?: boolean;
  };
  classrooms: Classroom[];
}

export function StudentForm({ student, classrooms }: StudentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      create_account: false,
      full_name: student?.full_name || "",
      email: student?.email || "",
      password: "",
      confirm_password: "",
      classroom_id: student?.classroom_id || "",
      notes: student?.notes || "",
    },
  });

  const watchCreateAccount = form.watch("create_account");

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("full_name", values.full_name);
      formData.append("email", values.email || "");
      formData.append("classroom_id", values.classroom_id || "");
      formData.append("notes", values.notes || "");

      let result;
      if (student) {
        result = await updateStudent(student.id, formData);
      } else if (values.create_account) {
        formData.append("password", values.password || "");
        result = await createStudentWithAuth(formData);
      } else {
        result = await createStudent(formData);
      }

      if (result.success) {
        toast.success(
          student ? "Siswa berhasil diperbarui" : "Siswa berhasil ditambahkan"
        );
        router.push("/students");
        router.refresh();
      } else {
        toast.error(result.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Terjadi kesalahan tak terduga");
    } finally {
      setIsSubmitting(false);
    }
  }

  const validClassrooms = classrooms.filter((c) => c.id && c.id.trim() !== "");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-6"
      >
        {student?.has_login && (
          <div
            className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/20 dark:text-amber-200"
            role="alert"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <div>
              <p className="font-medium">Siswa ini sudah memiliki akun login</p>
              <p className="mt-1 text-amber-700 dark:text-amber-300">
                Email tidak dapat diubah dan terikat ke akun login siswa. Untuk
                mengganti email, hubungi admin.
              </p>
            </div>
          </div>
        )}

        <fieldset disabled={isSubmitting} className="space-y-6">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="student-name">Nama Lengkap</FormLabel>
                <FormControl>
                  <Input
                    id="student-name"
                    placeholder="Nama siswa"
                    aria-required="true"
                    {...field}
                  />
                </FormControl>
                <FormMessage role="alert" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="student-email">
                  Email
                  {student?.has_login ? (
                    <span className="text-xs text-muted-foreground ml-1">
                      (tidak bisa diubah)
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs ml-1">
                      (opsional)
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="email@contoh.com"
                    readOnly={!!student?.has_login}
                    className={
                      student?.has_login
                        ? "bg-muted cursor-not-allowed opacity-70"
                        : ""
                    }
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {student?.has_login
                    ? "Email terikat ke akun login. Untuk mengganti, hubungi admin."
                    : "Email kontak untuk siswa atau orang tua"}
                </FormDescription>
                <FormMessage role="alert" />
              </FormItem>
            )}
          />

          {!student && (
            <FormField
              control={form.control}
              name="create_account"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                      }}
                      disabled={!!student}
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
          )}

          {watchCreateAccount && !student && (
            <div className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-medium text-primary flex items-center gap-2">
                <Info className="h-4 w-4" aria-hidden="true" />
                Detail Akun Login
              </p>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="student-email">
                      Email <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="student-email"
                        type="email"
                        placeholder="email@contoh.com"
                        aria-required="true"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage role="alert" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="student-password">
                      Password <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="student-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimal 6 karakter"
                          aria-required="true"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          aria-label={
                            showPassword
                              ? "Sembunyikan password"
                              : "Tampilkan password"
                          }
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage role="alert" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="student-confirm-password">
                      Konfirmasi Password{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="student-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Ketik ulang password"
                          aria-required="true"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          aria-label={
                            showConfirmPassword
                              ? "Sembunyikan password"
                              : "Tampilkan password"
                          }
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage role="alert" />
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="classroom_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Kelas{" "}
                  <span className="text-muted-foreground text-xs">
                    (opsional)
                  </span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger aria-label="Pilih kelas">
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none" disabled>
                      Pilih kelas (opsional)
                    </SelectItem>
                    {validClassrooms.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Masukkan siswa ke kelas (bisa diatur nanti)
                </FormDescription>
                <FormMessage role="alert" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="student-notes">
                  Catatan{" "}
                  <span className="text-muted-foreground text-xs">
                    (opsional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    id="student-notes"
                    placeholder="Catatan tambahan tentang siswa ini"
                    {...field}
                  />
                </FormControl>
                <FormMessage role="alert" />
              </FormItem>
            )}
          />
        </fieldset>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting && (
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {student ? "Simpan Perubahan" : "Tambah Siswa"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Batal
          </Button>
        </div>

        <div aria-live="polite" className="sr-only">
          {isSubmitting ? "Menyimpan data siswa, harap tunggu" : ""}
        </div>
      </form>
    </Form>
  );
}
