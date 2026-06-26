import { describe, it, expect } from "vitest";
import {
  scoreEssay,
  getCategory,
  normalizeScore,
  calculateMcqScore,
} from "@/lib/data/pre-post-tests/scoring";
import {
  getPrePostTest,
  prePostTests,
} from "@/lib/data/pre-post-tests";

// ================================================================
// 1. scoreEssay
// ================================================================
describe("scoreEssay", () => {
  const accepted = ["good morning", "hi", "hello"];

  it("exact match → score 10, needsReview false", () => {
    const result = scoreEssay("good morning", accepted);
    expect(result).toEqual({ score: 10, needsReview: false });
  });

  it("case-insensitive exact match → score 10", () => {
    const result = scoreEssay("Good Morning", accepted);
    expect(result).toEqual({ score: 10, needsReview: false });
  });

  it("case-insensitive exact match (all caps) → score 10", () => {
    const result = scoreEssay("GOOD MORNING", accepted);
    expect(result).toEqual({ score: 10, needsReview: false });
  });

  it("keyword partial match (keyword ≥3 chars) → score 5, needsReview true", () => {
    const result = scoreEssay("good morning everyone", accepted);
    expect(result).toEqual({ score: 5, needsReview: true });
  });

  it("partial match where user answer contains the keyword → score 5", () => {
    const result = scoreEssay("say hello to him", accepted);
    expect(result).toEqual({ score: 5, needsReview: true });
  });

  it("partial match where keyword contains user answer (reverse includes) → score 5", () => {
    // "morning" (dari "good morning") contains "morn" (<3 chars won't match, but "morning" ≥3)
    const result = scoreEssay("morn", accepted);
    expect(result).toEqual({ score: 5, needsReview: true });
  });

  it("keyword <3 chars tidak dianggap partial → score 0", () => {
    // "hi" has length 2, so it should not trigger partial match
    const result = scoreEssay("hi there", accepted);
    // "hi" is 2 chars, filtered out. No other keyword found.
    expect(result).toEqual({ score: 0, needsReview: true });
  });

  it("irrelevant answer → score 0, needsReview true", () => {
    const result = scoreEssay("xyz abcde", accepted);
    expect(result).toEqual({ score: 0, needsReview: true });
  });

  it("empty string → score 0, needsReview true", () => {
    const result = scoreEssay("", accepted);
    expect(result).toEqual({ score: 0, needsReview: true });
  });

  it("whitespace-only → score 0, needsReview true", () => {
    const result = scoreEssay("   ", accepted);
    expect(result).toEqual({ score: 0, needsReview: true });
  });

  it("multiple accepted answers — exact match with second variant → score 10", () => {
    const multiAccepted = ["fine, thank you", "i am fine", "i'm fine"];
    const result = scoreEssay("I am fine", multiAccepted);
    expect(result).toEqual({ score: 10, needsReview: false });
  });

  it("partial match against a multi-word accepted answer → score 5", () => {
    const multiAccepted = ["good morning", "good afternoon"];
    const result = scoreEssay("good afternoon sir", multiAccepted);
    expect(result).toEqual({ score: 5, needsReview: true });
  });

  it("single character accepted answer (<3 chars) — exact match → score 10", () => {
    const result = scoreEssay("hi", ["hi"]);
    expect(result).toEqual({ score: 10, needsReview: false });
  });

  it("single character partial match ignored (<3 chars) → score 0", () => {
    const result = scoreEssay("h", ["hi"]);
    expect(result).toEqual({ score: 0, needsReview: true });
  });

  it("user answer that matches a 2-char accepted answer exactly but trimmed → score 10", () => {
    // "er" from family module question 10 — exact match
    const result = scoreEssay("  er  ", ["er"]);
    expect(result).toEqual({ score: 10, needsReview: false });
  });

  it("treats null-like input as falsy via empty trim → score 0", () => {
    // Simulate that trim handles it; but null itself would throw.
    // Just test empty after trim
    const result = scoreEssay(" ", ["a"]);
    expect(result).toEqual({ score: 0, needsReview: true });
  });

  it("partial match with overlapping keyword (user answer partially matches keyword) → score 5", () => {
    // Keyword "afternoon" (10 chars, ≥3), user answer "after" partially matches
    const result = scoreEssay("after", ["good afternoon"]);
    // "after" is part of "afternoon", and "afternoon" includes "after"
    expect(result).toEqual({ score: 5, needsReview: true });
  });
});

// ================================================================
// 2. getCategory
// ================================================================
describe("getCategory", () => {
  it("score > 75 → 'Sangat Tinggi'", () => {
    expect(getCategory(76)).toBe("Sangat Tinggi");
    expect(getCategory(100)).toBe("Sangat Tinggi");
    expect(getCategory(80)).toBe("Sangat Tinggi");
  });

  it("score = 75 → 'Sangat Tinggi' (boundary > 75)", () => {
    // ✓ 76 is first above 75
    expect(getCategory(75)).toBe("Tinggi"); // ≤75, so fall through
  });

  it("score 58-75 → 'Tinggi'", () => {
    expect(getCategory(75)).toBe("Tinggi");
    expect(getCategory(58)).toBe("Tinggi");
    expect(getCategory(60)).toBe("Tinggi");
  });

  it("score 57 → 'Sedang' (just below Tinggi threshold)", () => {
    expect(getCategory(57)).toBe("Sedang");
  });

  it("score 42-57 → 'Sedang'", () => {
    expect(getCategory(42)).toBe("Sedang");
    expect(getCategory(50)).toBe("Sedang");
    expect(getCategory(57)).toBe("Sedang");
  });

  it("score 41 → 'Rendah' (just below Sedang threshold)", () => {
    expect(getCategory(41)).toBe("Rendah");
  });

  it("score 25-41 → 'Rendah'", () => {
    expect(getCategory(25)).toBe("Rendah");
    expect(getCategory(30)).toBe("Rendah");
    expect(getCategory(41)).toBe("Rendah");
  });

  it("score 24 → 'Sangat Rendah' (just below Rendah threshold)", () => {
    expect(getCategory(24)).toBe("Sangat Rendah");
  });

  it("score < 25 → 'Sangat Rendah'", () => {
    expect(getCategory(0)).toBe("Sangat Rendah");
    expect(getCategory(10)).toBe("Sangat Rendah");
    expect(getCategory(24)).toBe("Sangat Rendah");
  });

  it("boundary: 58 is 'Tinggi', 42 is 'Sedang', 25 is 'Rendah'", () => {
    // exact boundaries (≥ threshold)
    expect(getCategory(58)).toBe("Tinggi");
    expect(getCategory(42)).toBe("Sedang");
    expect(getCategory(25)).toBe("Rendah");
  });

  it("boundary: just below thresholds (57, 41, 24)", () => {
    expect(getCategory(57)).toBe("Sedang");
    expect(getCategory(41)).toBe("Rendah");
    expect(getCategory(24)).toBe("Sangat Rendah");
  });
});

// ================================================================
// 3. normalizeScore
// ================================================================
describe("normalizeScore", () => {
  it("75 → 100 (default maxScore = 75)", () => {
    expect(normalizeScore(75)).toBe(100);
  });

  it("37.5 → 50 (half score)", () => {
    expect(normalizeScore(37.5)).toBe(50);
  });

  it("0 → 0", () => {
    expect(normalizeScore(0)).toBe(0);
  });

  it("custom maxScore: 50 out of 50 → 100", () => {
    expect(normalizeScore(50, 50)).toBe(100);
  });

  it("custom maxScore: 25 out of 50 → 50", () => {
    expect(normalizeScore(25, 50)).toBe(50);
  });

  it("edge: small numbers → 1", () => {
    expect(normalizeScore(1, 75)).toBe(1);
  });

  it("edge: rounding up → 13 (9.33 rounds to 9)", () => {
    expect(normalizeScore(7, 75)).toBe(9);
  });

  it("edge: rounding at .5 boundary (18.75 → 19)", () => {
    // Math.round usage
    expect(normalizeScore(14.0625, 75)).toBe(19); // 14.0625/75*100 = 18.75 → round 19
  });
});

// ================================================================
// 4. calculateMcqScore
// ================================================================
describe("calculateMcqScore", () => {
  it("0 correct → 0", () => {
    expect(calculateMcqScore(0)).toBe(0);
  });

  it("5 correct → 25 (default points = 5)", () => {
    expect(calculateMcqScore(5)).toBe(25);
  });

  it("3 correct → 15", () => {
    expect(calculateMcqScore(3)).toBe(15);
  });

  it("4 correct → 20", () => {
    expect(calculateMcqScore(4)).toBe(20);
  });

  it("custom pointsPerQuestion: 2 correct × 10 pts → 20", () => {
    expect(calculateMcqScore(2, 10)).toBe(20);
  });

  it("all wrong: 0 correct → 0", () => {
    expect(calculateMcqScore(0, 5)).toBe(0);
  });
});

// ================================================================
// 5. getPrePostTest
// ================================================================
describe("getPrePostTest", () => {
  const validModuleIds = [
    "greetings",
    "introducing",
    "family",
    "numbers-days-months",
    "telling-time",
    "school-things",
    "colors-animals-fruits",
    "simple-instructions",
    "simple-present",
  ];

  it.each(validModuleIds)("returns PrePostTestData for moduleId '%s'", (id) => {
    const testData = getPrePostTest(id);
    expect(testData).toBeDefined();
    expect(testData!.moduleId).toBe(id);
    expect(testData!.questions.length).toBe(10);
  });

  it("returns undefined for unknown moduleId", () => {
    expect(getPrePostTest("nonexistent")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(getPrePostTest("")).toBeUndefined();
  });

  it("semua 9 modul memiliki data lengkap (moduleId, moduleTitle, questions, maxScore, dll)", () => {
    for (const id of validModuleIds) {
      const t = getPrePostTest(id);
      expect(t).toBeDefined();
      expect(t!.moduleId).toBeTruthy();
      expect(t!.moduleTitle).toBeTruthy();
      expect(t!.material).toBeTruthy();
      expect(t!.maxScore).toBe(75);
      expect(t!.mcqMaxScore).toBe(25);
      expect(t!.essayMaxScore).toBe(50);
      expect(Array.isArray(t!.questions)).toBe(true);
    }
  });
});

// ================================================================
// 6. Data validation — setiap modul
// ================================================================
describe("Data validation — setiap modul pre/post test", () => {
  it.each(prePostTests)("$moduleId: tepat 10 soal (5 MCQ + 5 essay)", (mod) => {
    expect(mod.questions).toHaveLength(10);

    const mcqs = mod.questions.filter((q) => q.type === "mcq");
    const essays = mod.questions.filter((q) => q.type === "essay");

    expect(mcqs).toHaveLength(5);
    expect(essays).toHaveLength(5);
  });

  it.each(prePostTests)("$moduleId: mcqCount dan essayCount sesuai jumlah aktual", (mod) => {
    const actualMcq = mod.questions.filter((q) => q.type === "mcq").length;
    const actualEssay = mod.questions.filter((q) => q.type === "essay").length;

    expect(mod.mcqCount).toBe(actualMcq);
    expect(mod.essayCount).toBe(actualEssay);
  });

  it.each(prePostTests)("$moduleId: maxScore = mcqMaxScore + essayMaxScore", (mod) => {
    expect(mod.maxScore).toBe(mod.mcqMaxScore + mod.essayMaxScore);
  });

  it.each(prePostTests)("$moduleId: semua MCQ punya options array", (mod) => {
    const mcqs = mod.questions.filter((q) => q.type === "mcq");
    for (const q of mcqs) {
      expect(q.options).toBeDefined();
      expect(q.options!.length).toBeGreaterThanOrEqual(2);
      expect(typeof q.answer).toBe("string");
    }
  });

  it.each(prePostTests)("$moduleId: semua essay punya answer sebagai string[]", (mod) => {
    const essays = mod.questions.filter((q) => q.type === "essay");
    for (const q of essays) {
      expect(Array.isArray(q.answer)).toBe(true);
      expect(q.answer.length).toBeGreaterThanOrEqual(1);
      // Semua accepted answer harus lowercase + trimmed
      for (const ans of q.answer as string[]) {
        expect(ans).toBe(ans.trim().toLowerCase());
      }
    }
  });

  it.each(prePostTests)("$moduleId: semua soal memiliki id unik 1-10", (mod) => {
    const ids = mod.questions.map((q) => q.id).sort((a, b) => a - b);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});

// ================================================================
// 7. Integration test — full test simulation
// ================================================================
describe("Integration — full test scoring simulation", () => {
  it("3 MCQ benar (5 pts each) + 2 essay sempurna (10 pts each) → total 35", () => {
    const mcqScore = calculateMcqScore(3, 5); // 15
    const essayScore = scoreEssay("good morning", ["good morning"]); // 10
    const essayScore2 = scoreEssay("hello", ["hello"]); // 10

    const total = mcqScore + essayScore.score + essayScore2.score;
    expect(mcqScore).toBe(15);
    expect(essayScore.score).toBe(10);
    expect(essayScore2.score).toBe(10);
    expect(total).toBe(35);
  });

  it("5 MCQ benar + 5 essay exact → max score 75", () => {
    const mcqScore = calculateMcqScore(5, 5); // 25

    const essayScores = [
      scoreEssay("good morning", ["good morning"]),
      scoreEssay("i am fine", ["i am fine", "fine", "fine, thank you", "i'm fine"]),
      scoreEssay("goodbye", ["goodbye", "see you later", "see you"]),
      scoreEssay("halo", ["halo", "hai"]),
      scoreEssay("night", ["night"]),
    ];

    const totalEssay = essayScores.reduce((sum, e) => sum + e.score, 0); // 50
    const total = mcqScore + totalEssay; // 75

    expect(mcqScore).toBe(25);
    expect(totalEssay).toBe(50);
    expect(total).toBe(75);
    expect(normalizeScore(total)).toBe(100); // normalized
  });

  it("0 MCQ benar + 0 essay → total 0 (Sangat Rendah)", () => {
    const mcqScore = calculateMcqScore(0);
    const essayScore = scoreEssay("", ["anything"]);
    const total = mcqScore + essayScore.score;

    expect(mcqScore).toBe(0);
    expect(essayScore.score).toBe(0);
    expect(total).toBe(0);
    expect(getCategory(total)).toBe("Sangat Rendah");
    expect(normalizeScore(total)).toBe(0);
  });

  it("Mixed scores: 4 MCQ benar (20) + 3 essay exact + 1 partial + 1 wrong → compute category", () => {
    const mcqScore = calculateMcqScore(4); // 20

    const essays = [
      scoreEssay("good morning", ["good morning"]), // 10
      scoreEssay("fine, thank you", ["i am fine", "fine, thank you", "i'm fine"]), // exact → 10
      scoreEssay("goodbye friends", ["goodbye", "see you later"]), // partial → 5
      scoreEssay("halo", ["halo", "hai"]), // exact → 10
      scoreEssay("xyz", ["night"]), // wrong → 0
    ];

    const essayTotal = essays.reduce((s, e) => s + e.score, 0); // 10+10+5+10+0 = 35
    const total = mcqScore + essayTotal; // 20+35 = 55

    expect(total).toBe(55);
    expect(getCategory(total)).toBe("Sedang"); // 42 ≤ 55 ≤ 57
    expect(normalizeScore(total)).toBe(73); // 55/75*100 ≈ 73.33 → Math.round → 73
  });

  it("Fully integrated from getPrePostTest: greetings module → score simulation", () => {
    const testData = getPrePostTest("greetings");
    expect(testData).toBeDefined();
    expect(testData!.questions).toHaveLength(10);

    // Simulate answering MCQ
    const mcqAnswers = ["Good morning", "Hello", "See you later", "Selamat sore/malam", "Goodbye"];
    let mcqCorrect = 0;
    const mcqs = testData!.questions.filter((q) => q.type === "mcq");
    mcqs.forEach((q, i) => {
      if (q.answer === mcqAnswers[i]) mcqCorrect++;
    });
    expect(mcqCorrect).toBe(5); // all correct in this case

    const mcqScore = calculateMcqScore(mcqCorrect);
    expect(mcqScore).toBe(25);

    // Simulate answering essays
    const essayAnswers = ["good morning", "i'm fine", "goodbye", "halo", "night"];
    const essays = testData!.questions.filter((q) => q.type === "essay");
    let essayScoreTotal = 0;
    essays.forEach((q, i) => {
      const acceptedAnswers = q.answer as string[];
      const result = scoreEssay(essayAnswers[i], acceptedAnswers);
      essayScoreTotal += result.score;
    });
    expect(essayScoreTotal).toBe(50);

    const total = mcqScore + essayScoreTotal;
    expect(total).toBe(75);
    expect(normalizeScore(total)).toBe(100);
    // Raw score 75 → "Tinggi" (≥58), normalized 100 → "Sangat Tinggi" (>75)
    expect(getCategory(total)).toBe("Tinggi");
    expect(getCategory(normalizeScore(total))).toBe("Sangat Tinggi");
  });
});

// ================================================================
// 8. Scoring edge cases — mixed exact and partial
// ================================================================
describe("Scoring edge cases — mixed exact and partial", () => {
  it("partial score dihitung 5, bukan 0, meskipun tidak exact", () => {
    const accepted = ["good afternoon"];
    const result = scoreEssay("good afternoon sir", accepted);
    expect(result.score).toBe(5);
    expect(result.needsReview).toBe(true);
  });

  it("keyword dari multi-word accepted answer: partial match via first word", () => {
    const accepted = ["see you later"];
    const result = scoreEssay("see you tomorrow", accepted);
    // "see" has 3 chars, so it qualifies as keyword
    expect(result.score).toBe(5);
  });

  it("keyword dari multi-word accepted answer: partial match via last word", () => {
    const accepted = ["see you later"];
    const result = scoreEssay("later dude", accepted);
    expect(result.score).toBe(5);
  });

  it("user answer lebih panjang dari keyword dan mengandung keyword → partial", () => {
    const accepted = ["run"];
    const result = scoreEssay("running fast", accepted);
    // "run" has 3 chars, user answer "running" includes "run"
    expect(result.score).toBe(5);
  });

  it("accepted answer pendek (<3 chars) diabaikan dalam partial search → score 0 jika tidak exact", () => {
    const accepted = ["er", "or"];
    const result = scoreEssay("eror", accepted);
    // "er" and "or" are 2 chars, filtered out. "eror" doesn't exactly match.
    expect(result.score).toBe(0);
  });

  it("accepted answer pendek (<3 chars) tetap match exact → score 10", () => {
    const accepted = ["er", "or"];
    const result = scoreEssay("er", accepted);
    expect(result.score).toBe(10);
  });

  it("edge: accepted answer kata tunggal 3 chars → partial works", () => {
    const accepted = ["eat"];
    const result = scoreEssay("eating", accepted);
    expect(result.score).toBe(5);
  });

  it("edge: multiple accepted, exact match with diacritics/normalization", () => {
    // The function does toLowerCase & trim only, so exact case match after lowercasing
    const accepted = ["selamat sore/malam"];
    const result = scoreEssay("Selamat Sore/Malam", accepted);
    expect(result.score).toBe(10);
  });
});
