import { createClient } from "@/lib/supabase/server";
import {
  Braces,
  BookOpen,
  Dumbbell,
  ClipboardList,
  Users,
  School,
} from "lucide-react";
import Link from "next/link";

const actions = [
  {
    href: "/braille-reference",
    icon: Braces,
    label: "Panduan Braille",
    desc: "Referensi titik Braille A–Z dan angka",
  },
  {
    href: "/learn",
    icon: BookOpen,
    label: "Modul Belajar",
    desc: "Buka modul untuk sesi mengajar",
  },
  {
    href: "/practice",
    icon: Dumbbell,
    label: "Practice",
    desc: "Latihan menyanyi dan berhitung",
  },
  {
    href: "/quiz",
    icon: ClipboardList,
    label: "Quiz & Test",
    desc: "Tampilkan soal quiz ke siswa",
  },
  {
    href: "/students",
    icon: Users,
    label: "Siswa",
    desc: "Kelola daftar siswa kelas",
  },
  {
    href: "/classrooms",
    icon: School,
    label: "Kelas",
    desc: "Lihat dan kelola kelas kamu",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  const firstName = profile?.full_name?.split(" ")[0] || "Guru";

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Selamat datang, {firstName}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Pilih menu di bawah untuk memulai sesi mengajar.
        </p>
      </div>

      {/* Action Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map(({ href, icon: Icon, label, desc }) => (
          <div key={href} className="tactile-wrapper">
            <Link
              href={href}
              className="flex items-start gap-4 bg-card text-foreground rounded-2xl border-2 border-b-4 border-border px-5 py-4 hover:border-primary hover:bg-primary/5 active:border-b-2 active:translate-y-0.5 transition-all"
            >
              <div className="p-2.5 rounded-xl bg-primary/10 shrink-0 mt-0.5">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
