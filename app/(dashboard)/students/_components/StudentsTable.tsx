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
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
import { deleteStudent } from "../_actions/student-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

type StudentWithClassroom = {
  id: string;
  full_name: string;
  email: string | null;
  classroom_id: string | null;
  classrooms: { name: string } | null;
};

type Student = StudentWithClassroom;

interface StudentsTableProps {
  students: Student[];
}

export function StudentsTable({ students }: StudentsTableProps) {
  const router = useRouter();

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
