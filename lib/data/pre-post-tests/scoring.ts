/**
 * Score essay answer with partial match tolerance.
 * - 10: exact match → no review needed
 * - 5: partial match (keyword ≥3 chars) → needs review
 * - 0: wrong / empty → needs review
 */
export function scoreEssay(
  userAnswer: string,
  acceptedAnswers: string[]
): { score: 0 | 5 | 10; needsReview: boolean } {
  const answer = userAnswer.trim().toLowerCase();
  if (!answer) return { score: 0, needsReview: true };

  // Exact match
  if (acceptedAnswers.some((a) => a.toLowerCase() === answer)) {
    return { score: 10, needsReview: false };
  }

  // Partial — keyword minimal 3 chars
  const keywords = acceptedAnswers
    .flatMap((a) => a.split(" "))
    .filter((k) => k.length >= 3);

  const hasRelevantKeyword = keywords.some(
    (kw) => answer.includes(kw) || kw.includes(answer)
  );

  if (hasRelevantKeyword) {
    return { score: 5, needsReview: true };
  }

  return { score: 0, needsReview: true };
}

export function getCategory(score: number): string {
  if (score > 75) return "Sangat Tinggi";
  if (score >= 58) return "Tinggi";
  if (score >= 42) return "Sedang";
  if (score >= 25) return "Rendah";
  return "Sangat Rendah";
}

export function normalizeScore(rawScore: number, maxScore: number = 75): number {
  return Math.round((rawScore / maxScore) * 100);
}

export function calculateMcqScore(
  correctCount: number,
  pointsPerQuestion: number = 5
): number {
  return correctCount * pointsPerQuestion;
}
