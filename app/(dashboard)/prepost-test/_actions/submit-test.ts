"use server";

import { createClient } from "@/lib/supabase/server";
import { getPrePostTest } from "@/lib/data/pre-post-tests";
import { scoreEssay, normalizeScore } from "@/lib/data/pre-post-tests/scoring";
import { revalidatePath } from "next/cache";
import type { PrePostAnswer } from "@/types";

export async function submitPrePostTest(data: {
  studentId: string;
  teacherId: string;
  moduleId: string;
  testType: "pre" | "post";
  answers: PrePostAnswer[];
}) {
  // 1. Validasi auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Silakan login." };
  if (user.id !== data.teacherId) return { success: false, error: "Tidak diizinkan." };

  // 2. Ambil data soal untuk scoring
  const testData = getPrePostTest(data.moduleId);
  if (!testData) return { success: false, error: "Modul tidak ditemukan." };

  // 3. Hitung skor
  let mcqScore = 0;
  let essayScore = 0;
  let pendingReview = false;

  for (const answer of data.answers) {
    if (answer.questionType === "mcq") {
      const isCorrect = answer.userAnswer?.trim().toLowerCase() ===
        String(answer.correctAnswer).trim().toLowerCase();
      answer.isCorrect = isCorrect;
      if (isCorrect) mcqScore += 5;
    } else {
      const essayResult = scoreEssay(answer.userAnswer || "", answer.correctAnswer as string[]);
      essayScore += essayResult.score;
      (answer as any).essayScore = essayResult.score;
      if (essayResult.needsReview) pendingReview = true;
    }
  }

  const totalScore = mcqScore + essayScore;
  const normalized = normalizeScore(totalScore);

  // 4. Simpan
  const { error } = await (supabase.from("pre_post_results" as any) as any).insert({
    student_id: data.studentId,
    teacher_id: data.teacherId,
    module_id: data.moduleId,
    test_type: data.testType,
    score: totalScore,
    score_normalized: normalized,
    mcq_score: mcqScore,
    essay_score: essayScore,
    answers: data.answers as any,
    status: pendingReview ? "pending_review" : "completed",
  });

  if (error) return { success: false, error: "Gagal menyimpan hasil." };

  revalidatePath(`/prepost-test/${data.moduleId}/results`);
  return { success: true, score: totalScore, normalized };
}
