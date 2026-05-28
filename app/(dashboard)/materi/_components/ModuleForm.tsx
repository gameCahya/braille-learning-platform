"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Switch } from "@/components/ui/switch";
import { createTeacherModule, updateTeacherModule } from "../_actions/module-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { useState } from "react";
import { nanoid } from "nanoid";
import type { TeacherModule } from "@/types";

const formSchema = z.object({
  title: z.string().min(1, "Judul modul wajib diisi"),
  description: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  is_published: z.boolean(),
  lessons: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Judul pelajaran wajib diisi"),
        content: z.string().min(1, "Konten pelajaran wajib diisi"),
        braille: z.string().optional(),
      })
    )
    .min(1, "Minimal satu pelajaran"),
});

type FormValues = z.infer<typeof formSchema>;

const DIFFICULTY_LABELS = {
  beginner: "Pemula",
  intermediate: "Menengah",
  advanced: "Lanjut",
} as const;

interface ModuleFormProps {
  module?: TeacherModule;
}

export function ModuleForm({ module }: ModuleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: module?.title ?? "",
      description: module?.description ?? "",
      difficulty: (module?.difficulty as FormValues["difficulty"]) ?? "beginner",
      is_published: module?.is_published ?? false,
      lessons: module?.lessons.length
        ? module.lessons
        : [{ id: nanoid(), title: "", content: "", braille: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lessons",
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const result = module
        ? await updateTeacherModule(module.id, values)
        : await createTeacherModule(values);

      if (result.success) {
        toast.success(module ? "Modul berhasil diperbarui" : "Modul berhasil dibuat");
        router.push("/materi");
        router.refresh();
      } else {
        toast.error(result.error ?? "Terjadi kesalahan");
      }
    } catch {
      toast.error("Terjadi kesalahan tak terduga");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Info Modul */}
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Informasi Modul</h2>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Judul Modul</FormLabel>
                <FormControl>
                  <Input placeholder="cth. Huruf Braille A–E" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi (opsional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Jelaskan isi modul ini..."
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 flex-wrap">
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem className="flex-1 min-w-[180px]">
                  <FormLabel>Tingkat Kesulitan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(DIFFICULTY_LABELS).map(([val, label]) => (
                        <SelectItem key={val} value={val}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_published"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end pb-1">
                  <FormLabel>Status</FormLabel>
                  <div className="flex items-center gap-3 h-10">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <span className="text-sm text-muted-foreground">
                      {field.value ? "Diterbitkan" : "Draft"}
                    </span>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Daftar Pelajaran */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">
              Pelajaran{" "}
              <span className="text-muted-foreground font-normal text-sm">
                ({fields.length})
              </span>
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({ id: nanoid(), title: "", content: "", braille: "" })
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Tambah Pelajaran
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-lg border p-5 space-y-4 bg-muted/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Pelajaran {index + 1}
                  </span>
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <FormField
                control={form.control}
                name={`lessons.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Pelajaran</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. Huruf A dan B" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`lessons.${index}.content`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konten</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tuliskan materi pelajaran di sini..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`lessons.${index}.braille`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Karakter Braille (opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="cth. ⠁ ⠃ ⠉" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          {form.formState.errors.lessons?.root && (
            <p className="text-sm text-destructive">
              {form.formState.errors.lessons.root.message}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {module ? "Simpan Perubahan" : "Buat Modul"}
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
      </form>
    </Form>
  );
}
