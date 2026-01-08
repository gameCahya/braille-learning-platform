"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  MessageSquare,
  BarChart3,
  FileText,
  Home,
} from "lucide-react";

const navigation = [
  {
    name: "Home",
    href: "/learn",
    icon: Home,
    description: "Dashboard overview",
  },
  {
    name: "Learn",
    href: "/learn/modules",
    icon: BookOpen,
    description: "Learning modules",
  },
  {
    name: "Converter",
    href: "/converter",
    icon: FileText,
    description: "Text ↔ Braille",
  },
  {
    name: "Practice",
    href: "/practice",
    icon: FileText,
    description: "Practice exercises",
  },
  {
    name: "AI Tutor",
    href: "/chatbot",
    icon: MessageSquare,
    description: "Chat with AI tutor",
  },
  {
    name: "Progress",
    href: "/progress",
    icon: BarChart3,
    description: "Track your progress",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-64 border-r bg-white dark:bg-slate-950 md:block overflow-y-auto"
      aria-label="Sidebar navigation"
    >
      <nav className="flex flex-col gap-1 p-4" role="navigation">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
              aria-current={isActive ? "page" : undefined}
              aria-label={`${item.name} - ${item.description}`}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  isActive
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-slate-500 dark:text-slate-400"
                )}
                aria-hidden="true"
              />
              <div className="flex flex-col">
                <span>{item.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {item.description}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Braille Quick Reference */}
      <div className="mx-4 my-4 rounded-lg border bg-slate-50 dark:bg-slate-900 p-4">
        <h3 className="text-sm font-semibold mb-2">Quick Reference</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span>A</span>
            <span className="font-mono text-lg">⠁</span>
          </div>
          <div className="flex items-center justify-between">
            <span>B</span>
            <span className="font-mono text-lg">⠃</span>
          </div>
          <div className="flex items-center justify-between">
            <span>C</span>
            <span className="font-mono text-lg">⠉</span>
          </div>
        </div>
        <Link
          href="/braille-reference"
          className="mt-3 block text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
        >
          View full reference →
        </Link>
      </div>
    </aside>
  );
}