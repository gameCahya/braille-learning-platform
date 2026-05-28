import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ModuleForm } from "../_components/ModuleForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function NewModulePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "teacher") redirect("/materi");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/materi"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali ke Materi
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Modul Baru</h1>
        <p className="text-muted-foreground">
          Buat modul pembelajaran baru untuk siswa Anda
        </p>
      </div>

      <ModuleForm />
    </div>
  );
}
