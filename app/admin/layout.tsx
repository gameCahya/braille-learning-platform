import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";
import { ShieldCheck } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/learn");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to main content — untuk pengguna screen reader */}
      <a
        href="#admin-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-md"
      >
        Langsung ke konten utama
      </a>

      <header className="bg-white border-b sticky top-0 z-10" aria-label="Header admin">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-600" aria-hidden="true" />
            <Link href="/admin" className="font-semibold text-gray-900">
              Admin Panel
            </Link>
            <span className="text-gray-300 mx-2" aria-hidden="true">|</span>
            <span className="text-sm text-gray-500">Braille Learning Platform</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">
              {profile.full_name ?? user.email}
            </span>
            <SignOutButton className="gap-1.5" />
          </div>
        </div>
      </header>

      <main id="admin-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
