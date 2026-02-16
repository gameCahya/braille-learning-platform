// lib/data/moduleMapping.ts

export const MODULE_UUID_MAP: Record<string, string> = {
  "module-1": "a1b2c3d4-e5f6-4789-a1b2-c3d4e5f6a7b8",
  "module-2": "b2c3d4e5-f6a7-4890-b2c3-d4e5f6a7b8c9",
  "module-3": "c3d4e5f6-a7b8-4901-c3d4-e5f6a7b8c9d0",
  "module-4": "d4e5f6a7-b8c9-4012-d4e5-f6a7b8c9d0e1",
  "module-5": "e5f6a7b8-c9d0-4123-e5f6-a7b8c9d0e1f2",

  // MODUL BARU
  "module-6": "f6a7b8c9-d0e1-4234-f6a7-b8c9d0e1f2a3", // benda di kelas
  "module-7": "a7b8c9d0-e1f2-4345-a7b8-c9d0e1f2a3b4", // warna
  "module-8": "b8c9d0e1-f2a3-4456-b8c9-d0e1f2a3b4c5", // anggota tubuh
  "module-9": "c9d0e1f2-a3b4-4567-c9d0-e1f2a3b4c5d6", // benda di kamar mandi
  "module-10": "d0e1f2a3-b4c5-4678-d0e1-f2a3b4c5d6e7", // nama binatang
};

export function getModuleUUID(moduleId: string): string {
  return MODULE_UUID_MAP[moduleId] || moduleId;
}