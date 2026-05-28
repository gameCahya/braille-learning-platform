"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { deleteTeacherModule, togglePublishModule } from "../_actions/module-actions";
import { toast } from "sonner";
import { useState } from "react";
import type { TeacherModule } from "@/types";

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Pemula",
  intermediate: "Menengah",
  advanced: "Lanjut",
};

const DIFFICULTY_VARIANTS: Record<string, "default" | "secondary" | "destructive"> = {
  beginner: "secondary",
  intermediate: "default",
  advanced: "destructive",
};

interface ModulesTableProps {
  modules: TeacherModule[];
}

export function ModulesTable({ modules }: ModulesTableProps) {
  const [pending, setPending] = useState<string | null>(null);

  async function handleTogglePublish(mod: TeacherModule) {
    setPending(mod.id);
    const result = await togglePublishModule(mod.id, !mod.is_published);
    if (!result.success) toast.error(result.error ?? "Gagal mengubah status");
    setPending(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus modul ini? Tindakan ini tidak bisa dibatalkan.")) return;
    setPending(id);
    const result = await deleteTeacherModule(id);
    if (result.success) {
      toast.success("Modul berhasil dihapus");
    } else {
      toast.error(result.error ?? "Gagal menghapus modul");
    }
    setPending(null);
  }

  if (modules.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          Belum ada modul. Buat modul pertama Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Kesulitan</TableHead>
            <TableHead>Target Kelas</TableHead>
            <TableHead className="text-center">Pelajaran</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {modules.map((mod) => (
            <TableRow key={mod.id} className={pending === mod.id ? "opacity-50" : ""}>
              <TableCell className="font-medium">
                <Link
                  href={`/materi/${mod.id}`}
                  className="hover:underline underline-offset-2"
                >
                  {mod.title}
                </Link>
                {mod.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {mod.description}
                  </p>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={DIFFICULTY_VARIANTS[mod.difficulty] ?? "secondary"}>
                  {DIFFICULTY_LABELS[mod.difficulty] ?? mod.difficulty}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                {mod.target_grade ? `Kelas ${mod.target_grade}` : "Semua"}
              </TableCell>
              <TableCell className="text-center text-sm">
                {mod.lessons.length}
              </TableCell>
              <TableCell>
                <Badge variant={mod.is_published ? "default" : "outline"}>
                  {mod.is_published ? "Diterbitkan" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/materi/${mod.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/materi/${mod.id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleTogglePublish(mod)}
                      disabled={pending === mod.id}
                    >
                      {mod.is_published ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Jadikan Draft
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Terbitkan
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(mod.id)}
                      disabled={pending === mod.id}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
