import type { Grade, GradeModule } from "./types";
import { KELAS_7_MODULES } from "./kelas-7";
import { KELAS_8_MODULES } from "./kelas-8";
import { KELAS_9_MODULES } from "./kelas-9";

export const ALL_MODULES: GradeModule[] = [
  ...KELAS_7_MODULES,
  ...KELAS_8_MODULES,
  ...KELAS_9_MODULES,
];

export function getModuleById(id: string): GradeModule | undefined {
  return ALL_MODULES.find((m) => m.id === id);
}

export function getModulesByGrade(grade: Grade): GradeModule[] {
  switch (grade) {
    case 7: return KELAS_7_MODULES;
    case 8: return KELAS_8_MODULES;
    case 9: return KELAS_9_MODULES;
  }
}

export function getGradeInfo(grade: Grade): { label: string; description: string } {
  switch (grade) {
    case 7: return { label: "Kelas 7", description: "Materi Bahasa Inggris kelas 7 SMPLB" };
    case 8: return { label: "Kelas 8", description: "Materi Bahasa Inggris kelas 8 SMPLB" };
    case 9: return { label: "Kelas 9", description: "Materi Bahasa Inggris kelas 9 SMPLB" };
  }
}

export { type Grade, type GradeModule } from "./types";
