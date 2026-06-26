"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface EssayScore {
  questionId: number;
  score: 0 | 5 | 10;
}

export async function reviewEssay(resultId: string, essayScores: EssayScore[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Silakan login." };

  // Ambil result — pastikan milik guru ini
  const { data: result } = await (supabase.from("pre_post_results" as any) as any)
    .select("*")
    .eq("id", resultId)
    .eq("teacher_id", user.id)
    .single();

  if (!result) return { success: false, error: "Data tidak ditemukan." };

  // Hitung ulang essay_score
  const oldEssayScore = result.essay_score || 0;
  let newEssayScore = 0;
  const updatedEssayResults = (result.essay_results || []).map((er: any) => {
    const found = essayScores.find((es) => es.questionId === er.questionId);
    if (found) {
      newEssayScore += found.score;
      return { ...er, score: found.score };
    }
    newEssayScore += er.score || 0;
    return er;
  });

  // Update total
  const totalScore = (result.mcq_score || 0) + newEssayScore;
  const normalized = Math.round((totalScore / 75) * 100);
  const allReviewed = updatedEssayResults.every(
    (er: any) => er.score !== undefined && er.score !== null
  );

  const { error } = await (supabase.from("pre_post_results" as any) as any)
    .update({
      essay_score: newEssayScore,
      score: totalScore,
      score_normalized: normalized,
      essay_results: updatedEssayResults,
      status: allReviewed ? "completed" : "pending_review",
      updated_at: new Date().toISOString(),
    })
    .eq("id", resultId);

  if (error) return { success: false, error: "Gagal menyimpan review." };

  revalidatePath(`/prepost-test/review`);
  return { success: true };
}
