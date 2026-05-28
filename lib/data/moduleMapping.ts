// lib/data/moduleMapping.ts
// Map module IDs (e.g. "k7-mod-1") to stable UUIDs for class_progress tracking

export const MODULE_UUID_MAP: Record<string, string> = {
  // === KELAS 7 ===
  "k7-mod-1": "a1000001-0001-4000-a000-000000000001", // Greetings
  "k7-mod-2": "a1000001-0002-4000-a000-000000000002", // Introducing Yourself
  "k7-mod-3": "a1000001-0003-4000-a000-000000000003", // Family Members
  "k7-mod-4": "a1000001-0004-4000-a000-000000000004", // Numbers, Days, Months
  "k7-mod-5": "a1000001-0005-4000-a000-000000000005", // Telling Time
  "k7-mod-6": "a1000001-0006-4000-a000-000000000006", // School Things
  "k7-mod-7": "a1000001-0007-4000-a000-000000000007", // Colors, Animals, Fruits
  "k7-mod-8": "a1000001-0008-4000-a000-000000000008", // Simple Instructions
  "k7-mod-9": "a1000001-0009-4000-a000-000000000009", // Simple Present Tense
  "k7-mod-10": "a1000001-0010-4000-a000-000000000010", // Descriptive Text

  // === KELAS 8 ===
  "k8-mod-1": "a2000002-0001-4000-a000-000000000001", // Giving Information
  "k8-mod-2": "a2000002-0002-4000-a000-000000000002", // Daily Activities
  "k8-mod-3": "a2000002-0003-4000-a000-000000000003", // Hobbies
  "k8-mod-4": "a2000002-0004-4000-a000-000000000004", // Shopping & Foods
  "k8-mod-5": "a2000002-0005-4000-a000-000000000005", // Asking Directions
  "k8-mod-6": "a2000002-0006-4000-a000-000000000006", // Simple Past Tense
  "k8-mod-7": "a2000002-0007-4000-a000-000000000007", // Imperative Sentences
  "k8-mod-8": "a2000002-0008-4000-a000-000000000008", // Announcement
  "k8-mod-9": "a2000002-0009-4000-a000-000000000009", // Songs

  // === KELAS 9 ===
  "k9-mod-1": "a3000003-0001-4000-a000-000000000001", // Daily Communication
  "k9-mod-2": "a3000003-0002-4000-a000-000000000002", // Asking Information
  "k9-mod-3": "a3000003-0003-4000-a000-000000000003", // Opinion
  "k9-mod-4": "a3000003-0004-4000-a000-000000000004", // Descriptive Text
  "k9-mod-5": "a3000003-0005-4000-a000-000000000005", // Functional Text
  "k9-mod-6": "a3000003-0006-4000-a000-000000000006", // Recount Text
  "k9-mod-7": "a3000003-0007-4000-a000-000000000007", // Tenses
  "k9-mod-8": "a3000003-0008-4000-a000-000000000008", // Public Places
  "k9-mod-9": "a3000003-0009-4000-a000-000000000009", // Shopping
  "k9-mod-10": "a3000003-0010-4000-a000-000000000010", // Procedure Text
};

export function getModuleUUID(moduleId: string): string {
  return MODULE_UUID_MAP[moduleId] || moduleId;
}
