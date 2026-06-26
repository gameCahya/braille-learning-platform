"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  School,
  BookOpen,
  Braces,
  ClipboardList,
  ClipboardCheck,
  Music,
  Dumbbell,
  GraduationCap,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { NavItem } from "./NavItem";
import { HelpCircle } from "lucide-react";

interface DashboardSidebarProps {
  role: "teacher" | "student";
}

function NavSection({ label }: { label: string }) {
  return (
    <p className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/40 select-none">
      {label}
    </p>
  );
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-sidebar">

      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6 shrink-0">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-sidebar-foreground">
          <BookOpen className="h-6 w-6 text-primary" />
          <span>Bralingo</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav id="sidebar-nav" aria-label="Navigasi sidebar" className="flex-1 overflow-y-auto p-3">
        <NavItem href="/" icon={LayoutDashboard} label="Dasbor" />

        {role === "teacher" ? (
          <>
            <NavSection label="Konten Pembelajaran" />
            <NavItem href="/materi" icon={Braces} label="Materi" />
            <NavItem href="/learn" icon={GraduationCap} label="Bahan Ajar" />
            <NavItem href="/practice" icon={Dumbbell} label="Practice" />
            <NavItem href="/quiz" icon={ClipboardList} label="Quiz & Test" />
            <NavItem href="/prepost-test" icon={ClipboardCheck} label="Pre/Post Test" />
            <NavItem href="/conversation" icon={MessageCircle} label="Conversation" />
            <NavItem href="/entertain" icon={Music} label="Entertain" />

            <NavSection label="Manajemen" />
            <NavItem href="/classrooms" icon={School} label="Kelas" />
            <NavItem href="/students" icon={Users} label="Siswa" />
            <NavItem href="/reports" icon={BarChart3} label="Laporan" />
          </>
        ) : (
          <>
            <NavSection label="Belajar" />
            <NavItem href="/learn" icon={GraduationCap} label="Bahan Ajar" />
            <NavItem href="/materi" icon={Braces} label="Materi" />
            <NavItem href="/practice" icon={Dumbbell} label="Latihan" />
            <NavItem href="/quiz" icon={ClipboardList} label="Quiz" />
            <NavItem href="/prepost-test" icon={ClipboardCheck} label="Pre/Post Test" />
            <NavItem href="/conversation" icon={MessageCircle} label="Conversation" />
            <NavItem href="/entertain" icon={Music} label="Entertain" />

            <NavSection label="Progres" />
            <NavItem href="/progress" icon={TrendingUp} label="Progres Saya" />
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t p-3 shrink-0">
        <NavItem href="/help" icon={HelpCircle} label="Panduan" />
        <NavItem href="/settings" icon={Settings} label="Pengaturan" />
      </div>
    </aside>
  );
}
