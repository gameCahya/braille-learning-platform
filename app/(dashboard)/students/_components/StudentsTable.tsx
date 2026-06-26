"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, UserPlus, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteStudent, createAuthForExistingStudent } from "../_actions/student-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

type StudentWithClassroom = {
  id: string;
  full_name: string;
  email: string | null;
  classroom_id: string | null;
  has_login: boolean;
  auth_user_id: string | null;
  classrooms: { name: string } | null;
};

type Student = StudentWithClassroom;

interface StudentsTableProps {
  students: Student[];
}

export function StudentsTable({ students }: StudentsTableProps) {
  const router = useRouter();
  const [buatAkunTarget, setBuatAkunTarget] = useState<StudentWithClassroom | null>(null);
  const [buatAkunOpen, setBuatAkunOpen] = useState(false);

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "full_name",
      header: "Nama",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("full_name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.getValue("email") || "—",
    },
    {
      accessorKey: "classrooms",
      header: "Kelas",
      cell: ({ row }) => {
        const name = row.original.classrooms?.name ?? null;
        return name ? (
          <Badge variant="outline">{name}</Badge>
        ) : (
          <span className="text-muted-foreground text-sm">Belum ada kelas</span>
        );
      },
    },
    {
      accessorKey: "has_login",
      header: "Akun Login",
      cell: ({ row }) => {
        const hasLogin = row.original.has_login;
        return hasLogin ? (
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 gap-1">
            <Check className="h-3 w-3" aria-hidden="true" />
            Ada
          </Badge>
        ) : (
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-muted-foreground">
              Tidak
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                setBuatAkunTarget(row.original);
                setBuatAkunOpen(true);
              }}
              aria-label={`Buatkan akun untuk ${row.original.full_name}`}
            >
              <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const studentId = row.original.id;
        const studentName = row.original.full_name;
        return (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild aria-label={`Edit ${studentName}`}>
              <Link href={`/students/${studentId}/edit`}>
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <DeleteStudentButton studentId={studentId} studentName={studentName} />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="rounded-md border">
        <Table aria-label="Daftar siswa">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Belum ada siswa.{" "}
                  <Link href="/students/new" className="text-primary underline">
                    Tambah siswa pertama
                  </Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <BuatAkunDialog
        student={buatAkunTarget}
        open={buatAkunOpen}
        onOpenChange={setBuatAkunOpen}
        onSuccess={() => {
          setBuatAkunTarget(null);
          window.location.reload();
        }}
      />
    </>
  );
}

function BuatAkunDialog({
  student,
  open,
  onOpenChange,
  onSuccess,
}: {
  student: StudentWithClassroom | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email tidak valid");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    setLoading(true);
    setError(null);
    const result = await createAuthForExistingStudent(student!.id, email, password);
    if (result.success) {
      toast.success(`Akun untuk ${student!.full_name} berhasil dibuat`);
      onOpenChange(false);
      onSuccess();
    } else {
      setError(result.error || "Gagal membuat akun");
    }
    setLoading(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!loading) {
      onOpenChange(open);
      if (!open) {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setError(null);
      }
    }
  };

  if (!student) return null;

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Buat Akun Login</AlertDialogTitle>
          <AlertDialogDescription>
            Buatkan akun login untuk <strong>{student.full_name}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20" role="alert">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="dialog-email">Email</Label>
            <Input
              id="dialog-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@contoh.com"
              disabled={loading}
              aria-required="true"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dialog-password">Password</Label>
            <Input
              id="dialog-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              disabled={loading}
              aria-required="true"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dialog-confirm">Konfirmasi Password</Label>
            <Input
              id="dialog-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ketik ulang password"
              disabled={loading}
              aria-required="true"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={loading || !email || !password}>
            {loading ? (
              <><Loader2 className="h-4 w-4 mr-1 animate-spin" aria-hidden="true" /> Membuat...</>
            ) : (
              "Buat Akun"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeleteStudentButton({ studentId, studentName }: { studentId: string; studentName: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteStudent(studentId);
    if (result?.error) {
      toast.error("Gagal menghapus siswa", { description: result.error });
      setLoading(false);
      return;
    }
    toast.success("Siswa berhasil dihapus");
    setOpen(false);
    setLoading(false);
    window.location.reload();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Hapus ${studentName}`}>
          <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Siswa?</AlertDialogTitle>
          <AlertDialogDescription>
            Siswa <strong>{studentName}</strong> akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
