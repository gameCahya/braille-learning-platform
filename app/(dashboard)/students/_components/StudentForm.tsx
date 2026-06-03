"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { createStudent, updateStudent } from "../_actions/student-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  full_name: z.string().min(1, "Nama lengkap wajib diisi"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  classroom_id: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

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
  };
  classrooms: Classroom[];
}

export function StudentForm({ student, classrooms }: StudentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: student?.full_name || "",
      email: student?.email || "",
      classroom_id: student?.classroom_id || "",
      notes: student?.notes || "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("full_name", values.full_name);
      formData.append("email", values.email || "");
      formData.append("classroom_id", values.classroom_id || "");
      formData.append("notes", values.notes || "");

      const result = student
        ? await updateStudent(student.id, formData)
        : await createStudent(formData);

      if (result.success) {
        toast.success(student ? "Siswa berhasil diperbarui" : "Siswa berhasil ditambahkan");
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
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">

        <fieldset disabled={isSubmitting} className="space-y-6">

          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="student-name">Nama Lengkap</FormLabel>
                <FormControl>
                  <Input id="student-name" placeholder="Nama siswa" aria-required="true" {...field} />
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
                <FormLabel htmlFor="student-email">Email <span className="text-muted-foreground text-xs">(opsional)</span></FormLabel>
                <FormControl>
                  <Input id="student-email" placeholder="email@contoh.com" type="email" {...field} />
                </FormControl>
                <FormDescription>Email kontak untuk siswa atau orang tua</FormDescription>
                <FormMessage role="alert" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="classroom_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kelas <span className="text-muted-foreground text-xs">(opsional)</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger aria-label="Pilih kelas">
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none" disabled>Pilih kelas (opsional)</SelectItem>
                    {validClassrooms.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Masukkan siswa ke kelas (bisa diatur nanti)</FormDescription>
                <FormMessage role="alert" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="student-notes">Catatan <span className="text-muted-foreground text-xs">(opsional)</span></FormLabel>
                <FormControl>
                  <Textarea id="student-notes" placeholder="Catatan tambahan tentang siswa ini" {...field} />
                </FormControl>
                <FormMessage role="alert" />
              </FormItem>
            )}
          />

        </fieldset>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
            {student ? "Simpan Perubahan" : "Tambah Siswa"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
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
