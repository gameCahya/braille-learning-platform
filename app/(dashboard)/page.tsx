import { createClient } from "@/lib/supabase/server";
import {
  Braces,
  BookOpen,
  ArrowLeftRight,
  Dumbbell,
  Music,
  MessageCircle,
  GraduationCap,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import TutorialDriver from "@/components/tutorial/TutorialDriver";
import { dashboardSteps } from "@/lib/tutorial/steps";

const allActions = [
  {
    href: "/learn",
    icon: GraduationCap,
    label: "Bahan Ajar",
    desc: "Modul pembelajaran Braille per kelas",
    roles: ["teacher", "student"],
  },
  {
    href: "/materi",
    icon: Braces,
    label: "Materi Guru",
    desc: "Modul buatan guru",
    roles: ["teacher"],
  },
  {
    href: "/practice",
    icon: Dumbbell,
    label: "Latihan",
    desc: "Latihan interaktif Braille — mode dengar tersedia",
    roles: ["teacher", "student"],
  },
  {
    href: "/quiz",
    icon: ClipboardList,
    label: "Quiz & Test",
    desc: "Uji pemahaman Braille",
    roles: ["teacher", "student"],
  },
  {
    href: "/conversation",
    icon: MessageCircle,
    label: "Conversation",
    desc: "Percakapan Bahasa Inggris dengan audio",
    roles: ["teacher", "student"],
  },
  {
    href: "/entertain",
    icon: Music,
    label: "Entertain",
    desc: "Lagu dan berhitung yang menyenangkan",
    roles: ["teacher", "student"],
  },
  {
    href: "/braille-reference",
    icon: Braces,
    label: "Panduan Braille",
    desc: "Referensi titik Braille A–Z, angka, dan tanda baca",
    roles: ["teacher"],
  },
  {
    href: "/converter",
    icon: ArrowLeftRight,
    label: "Konverter",
    desc: "Konversi teks ke Braille dan sebaliknya",
    roles: ["teacher"],
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user!.id)
    .single();

  const fullName = profile?.full_name ?? user?.email?.split("@")[0] ?? "Pengguna";
  const firstName = typeof fullName === "string" ? fullName.split(" ")[0] : fullName;
  const userRole = profile?.role ?? "student";

  const actions = allActions.filter((a) => a.roles.includes(userRole as string));

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div id="dashboard-greeting">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Selamat datang, {firstName}!
        </h1>
        <p className="text-muted-foreground mt-1">
          {userRole === "teacher"
            ? "Pilih menu di bawah untuk mulai mengajar."
            : "Pilih menu di bawah untuk mulai belajar."}
        </p>
      </div>

      {/* Action Grid */}
      <div id="dashboard-actions" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map(({ href, icon: ActionIcon, label, desc }) => (
          <div key={href} className="tactile-wrapper">
            <Link
              href={href}
              className="flex items-start gap-4 bg-card text-foreground rounded-2xl border-2 border-b-4 border-border px-5 py-4 hover:border-primary hover:bg-primary/5 active:border-b-2 active:translate-y-0.5 transition-all"
            >
              <div className="p-2.5 rounded-xl bg-primary/10 shrink-0 mt-0.5">
                <ActionIcon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <span className="font-semibold text-sm">{label}</span>
                <span className="text-xs text-muted-foreground mt-0.5">{desc}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <TutorialDriver steps={dashboardSteps} storageKey="bralingo-tutorial-dashboard" />
    </div>
  );
}
