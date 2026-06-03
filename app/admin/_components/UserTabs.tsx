"use client";

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
import { UserCheck } from "lucide-react";
import { PendingActionButtons, RoleSelect, StatusSelect } from "./UserActionButtons";

type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  role: "teacher" | "student" | "admin" | null;
  status: string;
  school_name: string | null;
  created_at: string;
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

export function UserTabs({ users }: { users: Profile[] }) {
  const pending = users.filter((u) => u.status === "pending");

  return (
    <Tabs defaultValue="pending">
      <TabsList aria-label="Filter pengguna">
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
                <UserCheck className="h-10 w-10 mx-auto mb-2 opacity-40" aria-hidden="true" />
                <p className="text-sm">Tidak ada pendaftaran yang menunggu</p>
              </div>
            ) : (
              <Table aria-label="Daftar pengguna menunggu persetujuan">
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

      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Semua Pengguna</CardTitle>
            <CardDescription>
              Kelola role dan status semua pengguna yang terdaftar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table aria-label="Daftar semua pengguna">
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
  );
}
