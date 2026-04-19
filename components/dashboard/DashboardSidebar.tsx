"use client";

// components/dashboard/DashboardSidebar.tsx
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings,
  School
} from "lucide-react";
import { NavItem } from "./NavItem";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-muted/40">
      {/* Logo / Brand */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
          <BookOpen className="h-6 w-6 text-primary" />
          <span>Bralingo</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <NavItem href="/" icon={LayoutDashboard} label="Dashboard" />
        <NavItem href="/classrooms" icon={School} label="Classes" />
        <NavItem href="/students" icon={Users} label="Students" />
        <NavItem href="/reports" icon={BarChart3} label="Reports" />
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <NavItem href="/settings" icon={Settings} label="Settings" />
      </div>
    </aside>
  );
}
