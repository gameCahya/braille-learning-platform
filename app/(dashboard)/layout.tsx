// app/(dashboard)/layout.tsx

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { LinearModeProvider } from "@/components/accessibility/LinearModeProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, role, school_name, grade_level")
    .eq("id", user.id)
    .single();

  // Admin punya dashboard sendiri di /admin
  if (profile?.role === "admin") {
    redirect("/admin");
  }

  const sidebarRole = (profile?.role === "teacher" || profile?.role === "student")
    ? profile.role
    : "teacher";

  return (
    <LinearModeProvider>
      <div className="flex h-screen overflow-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-lg focus:border focus:shadow-lg"
      >
        Langsung ke konten utama
      </a>
      <DashboardSidebar role={sidebarRole} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader user={user} profile={profile} />
        <main id="main-content" className="flex-1 overflow-y-auto bg-muted/30 p-6" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
    </LinearModeProvider>
  );
}
