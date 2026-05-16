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
  Dumbbell,
  ArrowLeftRight,
} from "lucide-react";
import { NavItem } from "./NavItem";

function NavSection({ label }: { label: string }) {
  return (
    <p className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/40 select-none">
      {label}
    </p>
  );
}

export function DashboardSidebar() {
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
      <nav className="flex-1 overflow-y-auto p-3">
        <NavItem href="/" icon={LayoutDashboard} label="Dashboard" />

        <NavSection label="Belajar Mandiri" />
        <NavItem href="/braille-reference" icon={Braces} label="Panduan Braille" />
        <NavItem href="/converter" icon={ArrowLeftRight} label="Konverter" />
        <NavItem href="/practice" icon={Dumbbell} label="Practice" />

        <NavSection label="Mengajar di Kelas" />
        <NavItem href="/learn" icon={BookOpen} label="Modul Belajar" />
        <NavItem href="/quiz" icon={ClipboardList} label="Quiz & Test" />

        <NavSection label="Manajemen" />
        <NavItem href="/classrooms" icon={School} label="Kelas" />
        <NavItem href="/students" icon={Users} label="Siswa" />
        <NavItem href="/reports" icon={BarChart3} label="Laporan" />
      </nav>

      {/* Footer */}
      <div className="border-t p-3 shrink-0">
        <NavItem href="/settings" icon={Settings} label="Pengaturan" />
      </div>
    </aside>
  );
}
