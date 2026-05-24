import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Clock, UserCheck, GraduationCap, BookOpen, ShieldCheck } from "lucide-react";
import { UserTabs } from "./_components/UserTabs";

type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  role: "teacher" | "student" | "admin" | null;
  status: string;
  school_name: string | null;
  created_at: string;
};

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: allUsers } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, status, school_name, created_at")
    .order("created_at", { ascending: false });

  const users = (allUsers ?? []) as Profile[];

  const pending = users.filter((u) => u.status === "pending");
  const approved = users.filter((u) => u.status === "approved");
  const teachers = approved.filter((u) => u.role === "teacher");
  const students = approved.filter((u) => u.role === "student");
  const admins = approved.filter((u) => u.role === "admin");

  const stats = [
    { label: "Total Pengguna", value: users.length, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Menunggu Persetujuan", value: pending.length, icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Guru Aktif", value: teachers.length, icon: BookOpen, color: "text-green-600 bg-green-50" },
    { label: "Siswa Aktif", value: students.length, icon: GraduationCap, color: "text-purple-600 bg-purple-50" },
    { label: "Admin", value: admins.length, icon: ShieldCheck, color: "text-indigo-600 bg-indigo-50" },
    { label: "Disetujui", value: approved.length, icon: UserCheck, color: "text-teal-600 bg-teal-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola pendaftaran dan pengguna platform Braille Learning.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`inline-flex rounded-lg p-2 mb-3 ${s.color}`}>
                <s.icon className="h-4 w-4" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <UserTabs users={users} />
    </div>
  );
}
