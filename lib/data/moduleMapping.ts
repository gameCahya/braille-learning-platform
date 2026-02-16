// UUID mapping untuk modules di database
export const MODULE_UUID_MAP: Record<string, string> = {
  "module-1": "a1b2c3d4-e5f6-4789-a1b2-c3d4e5f6a7b8",
  "module-2": "b2c3d4e5-f6a7-4890-b2c3-d4e5f6a7b8c9",
  "module-3": "c3d4e5f6-a7b8-4901-c3d4-e5f6a7b8c9d0",
  "module-4": "d4e5f6a7-b8c9-4012-d4e5-f6a7b8c9d0e1",
  "module-5": "e5f6a7b8-c9d0-4123-e5f6-a7b8c9d0e1f2",
};

// Helper function to get UUID from string ID
export function getModuleUUID(moduleId: string): string {
  return MODULE_UUID_MAP[moduleId] || moduleId;
}