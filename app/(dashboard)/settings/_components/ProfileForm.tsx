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
import { updateProfile } from "../_actions/profile-actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  full_name: z.string().min(1, "Nama lengkap wajib diisi"),
  school_name: z.string().min(1, "Nama sekolah wajib diisi"),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  profile: {
    full_name: string | null;
    avatar_url: string | null;
    role: string | null;
    school_name: string | null;
    email: string | null;
  } | null;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: profile?.full_name ?? "",
      school_name: profile?.school_name ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("full_name", values.full_name);
      formData.append("school_name", values.school_name);

      const result = await updateProfile(formData);

      if (result.success) {
        toast.success("Profil berhasil diperbarui");
      } else {
        toast.error(result.error ?? "Gagal memperbarui profil");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Terjadi kesalahan tak terduga");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama lengkap" {...field} />
              </FormControl>
              <FormDescription>
                Nama ini ditampilkan di seluruh halaman dashboard
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="school_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Sekolah</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama sekolah" {...field} />
              </FormControl>
              <FormDescription>
                Nama sekolah tempat kamu mengajar
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Simpan Perubahan
        </Button>
      </form>
    </Form>
  );
}
