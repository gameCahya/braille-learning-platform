"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Trash2, Loader2 } from "lucide-react";
import { deleteTeacherQuiz } from "../_actions/quiz-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteQuizButtonProps {
  quizId: string;
  quizTitle: string;
}

export function DeleteQuizButton({ quizId, quizTitle }: DeleteQuizButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteTeacherQuiz(quizId);
    if (result?.error) {
      toast.error("Gagal menghapus quiz", { description: result.error });
      setLoading(false);
      return;
    }
    toast.success("Quiz berhasil dihapus");
    setOpen(false);
    setLoading(false);
    router.refresh();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          aria-label={`Hapus quiz: ${quizTitle}`}
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Quiz?</AlertDialogTitle>
          <AlertDialogDescription>
            Quiz <strong>{quizTitle}</strong> akan dihapus permanen. Semua soal
            di dalamnya akan hilang. Tindakan ini tidak bisa dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
            )}
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
