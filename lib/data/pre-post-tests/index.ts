import type { PrePostTestData } from "@/types";
import { greetingsTest } from "./greetings";
import { introducingTest } from "./introducing";
import { familyTest } from "./family";
import { numbersDaysMonthsTest } from "./numbers-days-months";
import { tellingTimeTest } from "./telling-time";
import { schoolThingsTest } from "./school-things";
import { colorsAnimalsFruitsTest } from "./colors-animals-fruits";
import { simpleInstructionsTest } from "./simple-instructions";
import { simplePresentTest } from "./simple-present";

export const prePostTests: PrePostTestData[] = [
  greetingsTest,
  introducingTest,
  familyTest,
  numbersDaysMonthsTest,
  tellingTimeTest,
  schoolThingsTest,
  colorsAnimalsFruitsTest,
  simpleInstructionsTest,
  simplePresentTest,
];

// Validasi dev
if (process.env.NODE_ENV === "development") {
  for (const test of prePostTests) {
    const mcqActual = test.questions.filter((q) => q.type === "mcq").length;
    const essayActual = test.questions.filter((q) => q.type === "essay").length;
    if (mcqActual !== test.mcqCount)
      console.warn(`[PrePostTest] ${test.moduleId}: mcqCount mismatch`);
    if (essayActual !== test.essayCount)
      console.warn(`[PrePostTest] ${test.moduleId}: essayCount mismatch`);
  }
}

export function getPrePostTest(moduleId: string): PrePostTestData | undefined {
  return prePostTests.find((t) => t.moduleId === moduleId);
}
