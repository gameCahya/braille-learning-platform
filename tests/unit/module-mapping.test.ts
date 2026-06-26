import { describe, it, expect } from "vitest";
import { getModuleUUID, MODULE_UUID_MAP } from "@/lib/data/moduleMapping";

describe("MODULE_UUID_MAP", () => {
  it("memiliki 29 modul (10 kelas 7 + 9 kelas 8 + 10 kelas 9)", () => {
    expect(Object.keys(MODULE_UUID_MAP)).toHaveLength(29);
  });

  it("memiliki semua modul kelas 7", () => {
    for (let i = 1; i <= 10; i++) {
      expect(MODULE_UUID_MAP[`k7-mod-${i}`]).toBeDefined();
    }
  });

  it("memiliki semua modul kelas 8", () => {
    for (let i = 1; i <= 9; i++) {
      expect(MODULE_UUID_MAP[`k8-mod-${i}`]).toBeDefined();
    }
  });

  it("memiliki semua modul kelas 9", () => {
    for (let i = 1; i <= 10; i++) {
      expect(MODULE_UUID_MAP[`k9-mod-${i}`]).toBeDefined();
    }
  });

  it("semua UUID memiliki format UUID v4 yang valid", () => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    for (const uuid of Object.values(MODULE_UUID_MAP)) {
      expect(uuid).toMatch(uuidRegex);
    }
  });
});

describe("getModuleUUID", () => {
  it("mengembalikan UUID untuk k7-mod-1", () => {
    expect(getModuleUUID("k7-mod-1")).toBe(
      "a1000001-0001-4000-a000-000000000001"
    );
  });

  it("mengembalikan moduleId asli jika tidak ditemukan di map", () => {
    expect(getModuleUUID("unknown-module")).toBe("unknown-module");
  });
});
