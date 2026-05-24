import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Clock, UserCheck, GraduationCap, BookOpen, ShieldCheck } from "lucide-react";
import { PendingActionButtons, RoleSelect, StatusSelect } from "./_components/UserActionButtons";

type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  role: "teacher" | "student" | "admin" | null;
  status: string;
  school_name: string | null;
  created_at: string;
};

const STATUS_BADGE: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Menunggu", variant: "secondary" },
  approved: { label: "Disetujui", variant: "default" },
  rejected: { label: "Ditolak", variant: "destructive" },
};

const ROLE_LABEL: Record<string, string> = {
  teacher: "Guru",
  student: "Siswa",
  admin: "Admin",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

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

      {/* Statistik */}
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

      {/* Tabel */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-1.5">
            Menunggu
            {pending.length > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {pending.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">Semua Pengguna</TabsTrigger>
        </TabsList>

        {/* Tab: Pending */}
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Menunggu Persetujuan</CardTitle>
              <CardDescription>
                Pengguna yang baru mendaftar dan perlu disetujui atau ditolak.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pending.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <UserCheck className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Tidak ada pendaftaran yang menunggu</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mendaftar Sebagai</TableHead>
                      <TableHead>Sekolah</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pending.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">
                          {u.full_name ?? "-"}
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm">
                          {u.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {ROLE_LABEL[u.role ?? ""] ?? u.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {u.school_name ?? "-"}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(u.created_at)}
                        </TableCell>
                        <TableCell>
                          <PendingActionButtons userId={u.id} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Semua Pengguna */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Semua Pengguna</CardTitle>
              <CardDescription>
                Kelola role dan status semua pengguna yang terdaftar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Sekolah</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bergabung</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">
                        {u.full_name ?? "-"}
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {u.email}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {u.school_name ?? "-"}
                      </TableCell>
                      <TableCell>
                        <RoleSelect
                          userId={u.id}
                          currentRole={(u.role as "teacher" | "student" | "admin") ?? "student"}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusSelect
                          userId={u.id}
                          currentStatus={u.status as "pending" | "approved" | "rejected"}
                        />
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(u.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
