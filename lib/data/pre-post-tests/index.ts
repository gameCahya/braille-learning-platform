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
// Kelas VIII
import { givingInformationTest } from "./giving-information";
import { dailyActivitiesTest } from "./daily-activities";
import { hobbiesTest } from "./hobbies";
import { askingGivingDirectionsTest } from "./asking-giving-directions";
// Kelas IX
import { descriptiveTextTest } from "./descriptive-text";
import { functionalTextTest } from "./functional-text";
import { recountTextTest } from "./recount-text";
import { tensesTest } from "./tenses";
import { directionsPublicPlacesTest } from "./directions-public-places";
import { shoppingFoodsTest } from "./shopping-foods";
import { procedureTextTest } from "./procedure-text";

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
  // Kelas VIII
  givingInformationTest,
  dailyActivitiesTest,
  hobbiesTest,
  askingGivingDirectionsTest,
  // Kelas IX
  descriptiveTextTest,
  functionalTextTest,
  recountTextTest,
  tensesTest,
  directionsPublicPlacesTest,
  shoppingFoodsTest,
  procedureTextTest,
];

// Validasi dev
if (process.env.NODE_ENV === "development") {
  for (const test of prePostTests) {
    const mcqActual = test.questions.filter((q) => q.type === "mcq").length;
    const essayActual = test.questions.filter((q) => q.type === "essay").length;
    if (mcqActual !== test.mcqCount)
      console.warn(`[PrePostTest] ${test.moduleId} (kelas ${test.gradeLevel ?? "?"}): mcqCount mismatch`);
    if (essayActual !== test.essayCount)
      console.warn(`[PrePostTest] ${test.moduleId} (kelas ${test.gradeLevel ?? "?"}): essayCount mismatch`);
  }
}

export function getPrePostTest(moduleId: string): PrePostTestData | undefined {
  return prePostTests.find((t) => t.moduleId === moduleId);
}
