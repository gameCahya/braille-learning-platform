import { createClient } from "@/lib/supabase/server";
import {
  Braces,
  BookOpen,
  ArrowLeftRight,
} from "lucide-react";
import Link from "next/link";
import TutorialDriver from "@/components/tutorial/TutorialDriver";
import { dashboardSteps } from "@/lib/tutorial/steps";


const actions = [
  {
    href: "/learn",
    icon: BookOpen,
    label: "Modul Website",
    desc: "Modul pembelajaran dari guru",
  },
  {
    href: "/braille-reference",
    icon: Braces,
    label: "Panduan Braille",
    desc: "Referensi titik Braille A–Z, angka, dan tanda baca",
  },
  {
    href: "/converter",
    icon: ArrowLeftRight,
    label: "Konverter",
    desc: "Konversi teks ke Braille dan sebaliknya",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullName = user?.user_metadata?.full_name;
  const firstName =
    (typeof fullName === "string" ? fullName.split(" ")[0] : undefined) ??
    user?.email?.split("@")[0] ??
    "Pengguna";

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div id="dashboard-greeting">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Selamat datang, {firstName}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Pilih menu di bawah untuk mulai belajar.
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
