import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

describe("loginSchema", () => {
  it("menerima data login valid", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("menolak email kosong", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "password123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Email wajib diisi");
    }
  });

  it("menolak format email tidak valid", () => {
    const result = loginSchema.safeParse({
      email: "bukan-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Format email tidak valid");
    }
  });

  it("menolak password kosong", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Password wajib diisi");
    }
  });

  it("menolak password kurang dari 6 karakter", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "12345",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Password minimal 6 karakter");
    }
  });

  it("menolak input tanpa field required", () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("menerima data registrasi guru valid", () => {
    const result = registerSchema.safeParse({
      fullName: "Budi Santoso",
      role: "teacher" as const,
      schoolName: "SMPN 1 Jakarta",
      email: "budi@sekolah.com",
      password: "Password123",
      confirmPassword: "Password123",
    });
    expect(result.success).toBe(true);
  });

  it("menerima data registrasi siswa valid dengan gradeLevel", () => {
    const result = registerSchema.safeParse({
      fullName: "Ani",
      role: "student" as const,
      schoolName: "SMPN 1 Jakarta",
      gradeLevel: "7",
      email: "ani@sekolah.com",
      password: "Password123",
      confirmPassword: "Password123",
    });
    expect(result.success).toBe(true);
  });

  it("menolak registrasi siswa tanpa gradeLevel", () => {
    const result = registerSchema.safeParse({
      fullName: "Ani",
      role: "student" as const,
      schoolName: "SMPN 1 Jakarta",
      email: "ani@sekolah.com",
      password: "Password123",
      confirmPassword: "Password123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Tingkat kelas wajib dipilih");
    }
  });

  it("menolak nama kurang dari 2 karakter", () => {
    const result = registerSchema.safeParse({
      fullName: "A",
      role: "teacher" as const,
      schoolName: "SMPN 1",
      email: "a@b.com",
      password: "Password123",
      confirmPassword: "Password123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Nama lengkap minimal 2 karakter");
    }
  });

  it("menolak password kurang dari 8 karakter", () => {
    const result = registerSchema.safeParse({
      fullName: "Budi",
      role: "teacher" as const,
      schoolName: "SMPN 1",
      email: "budi@b.com",
      password: "Pass123",
      confirmPassword: "Pass123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages.some((m) => m.includes("Password minimal 8"))).toBe(true);
    }
  });

  it("menolak password tanpa huruf besar", () => {
    const result = registerSchema.safeParse({
      fullName: "Budi",
      role: "teacher" as const,
      schoolName: "SMPN 1",
      email: "budi@b.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages.some((m) => m.includes("huruf besar"))).toBe(true);
    }
  });

  it("menolak password tanpa angka", () => {
    const result = registerSchema.safeParse({
      fullName: "Budi",
      role: "teacher" as const,
      schoolName: "SMPN 1",
      email: "budi@b.com",
      password: "Password",
      confirmPassword: "Password",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages.some((m) => m.includes("angka"))).toBe(true);
    }
  });

  it("menolak confirmPassword tidak cocok", () => {
    const result = registerSchema.safeParse({
      fullName: "Budi",
      role: "teacher" as const,
      schoolName: "SMPN 1",
      email: "budi@b.com",
      password: "Password123",
      confirmPassword: "Password456",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages.some((m) => m.includes("Password tidak cocok"))).toBe(true);
    }
  });

  it("menolak role tidak valid", () => {
    const result = registerSchema.safeParse({
      fullName: "Budi",
      role: "admin",
      schoolName: "SMPN 1",
      email: "budi@b.com",
      password: "Password123",
      confirmPassword: "Password123",
    });
    expect(result.success).toBe(false);
  });

  it("menolak email tidak valid", () => {
    const result = registerSchema.safeParse({
      fullName: "Budi",
      role: "teacher" as const,
      schoolName: "SMPN 1",
      email: "bukan-email",
      password: "Password123",
      confirmPassword: "Password123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Format email tidak valid");
    }
  });
});
