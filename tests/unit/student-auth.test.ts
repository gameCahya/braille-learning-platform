import { describe, it, expect } from "vitest";
import { z } from "zod";

const formSchema = z
  .object({
    create_account: z.boolean().default(false),
    full_name: z.string().min(1, "Nama lengkap wajib diisi"),
    email: z.string().optional().or(z.literal("")),
    password: z.string().optional(),
    confirm_password: z.string().optional(),
    classroom_id: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.create_account) {
      if (!data.email || data.email.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email wajib diisi",
          path: ["email"],
        });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Format email tidak valid",
          path: ["email"],
        });
      }
      if (!data.password || data.password.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password minimal 6 karakter",
          path: ["password"],
        });
      }
      if (data.password !== data.confirm_password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password tidak cocok",
          path: ["confirm_password"],
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

/**
 * Helper to find an issue by path in the Zod error.
 */
function findIssue(error: z.ZodError, path: string) {
  return error.issues.find((i) => i.path.join(".") === path);
}

/**
 * Helper to extract issue messages for a given path.
 */
function messagesForPath(error: z.ZodError, path: string): string[] {
  return error.issues
    .filter((i) => i.path.join(".") === path)
    .map((i) => i.message);
}

describe("StudentForm conditional create_account schema", () => {
  // ── create_account = false ──

  it("create_account=false: menerima data tanpa email", () => {
    const result = formSchema.safeParse({
      full_name: "Budi Santoso",
      create_account: false,
    });
    expect(result.success).toBe(true);
  });

  it("create_account=false: menerima data dengan email opsional", () => {
    const result = formSchema.safeParse({
      full_name: "Siti Aminah",
      create_account: false,
      email: "siti@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("create_account=false: menolak saat full_name kosong (field required)", () => {
    const result = formSchema.safeParse({
      full_name: "",
      create_account: false,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const msgs = messagesForPath(result.error, "full_name");
      expect(msgs.some((m) => m.includes("Nama lengkap wajib diisi"))).toBe(true);
    }
  });

  // ── create_account = true → conditional validation ──

  it("create_account=true: menolak tanpa email", () => {
    const result = formSchema.safeParse({
      full_name: "Budi Santoso",
      create_account: true,
      password: "rahasia123",
      confirm_password: "rahasia123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const msgs = messagesForPath(result.error, "email");
      expect(msgs.some((m) => m.includes("Email wajib diisi"))).toBe(true);
    }
  });

  it("create_account=true: menolak email tidak valid", () => {
    const result = formSchema.safeParse({
      full_name: "Budi Santoso",
      create_account: true,
      email: "bukan-email",
      password: "rahasia123",
      confirm_password: "rahasia123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const msgs = messagesForPath(result.error, "email");
      expect(msgs.some((m) => m.includes("Format email tidak valid"))).toBe(true);
    }
  });

  it("create_account=true: menolak password kurang dari 6 karakter", () => {
    const result = formSchema.safeParse({
      full_name: "Budi Santoso",
      create_account: true,
      email: "budi@example.com",
      password: "abc12",
      confirm_password: "abc12",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const msgs = messagesForPath(result.error, "password");
      expect(msgs.some((m) => m.includes("Password minimal 6 karakter"))).toBe(true);
    }
  });

  it("create_account=true: menolak confirm_password tidak cocok", () => {
    const result = formSchema.safeParse({
      full_name: "Budi Santoso",
      create_account: true,
      email: "budi@example.com",
      password: "rahasia123",
      confirm_password: "berbeda456",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const msgs = messagesForPath(result.error, "confirm_password");
      expect(msgs.some((m) => m.includes("Password tidak cocok"))).toBe(true);
    }
  });

  it("create_account=true: menerima data valid (semua field benar)", () => {
    const result = formSchema.safeParse({
      full_name: "Ani Rahmawati",
      create_account: true,
      email: "ani@sekolah.com",
      password: "pass1234",
      confirm_password: "pass1234",
      classroom_id: "cls-001",
    });
    expect(result.success).toBe(true);
  });

  it("create_account=true: menolak password kosong", () => {
    const result = formSchema.safeParse({
      full_name: "Budi Santoso",
      create_account: true,
      email: "budi@example.com",
      password: "",
      confirm_password: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const msgs = messagesForPath(result.error, "password");
      expect(msgs.some((m) => m.includes("Password minimal 6 karakter"))).toBe(true);
    }
  });

  it("create_account=true: menolak email hanya berisi spasi", () => {
    const result = formSchema.safeParse({
      full_name: "Budi Santoso",
      create_account: true,
      email: "   ",
      password: "rahasia123",
      confirm_password: "rahasia123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const msgs = messagesForPath(result.error, "email");
      expect(msgs.some((m) => m.includes("Email wajib diisi"))).toBe(true);
    }
  });

  it("create_account=true: menolak tanpa password dan confirm_password", () => {
    const result = formSchema.safeParse({
      full_name: "Budi Santoso",
      create_account: true,
      email: "budi@example.com",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const pwdMsgs = messagesForPath(result.error, "password");
      expect(pwdMsgs.some((m) => m.includes("Password minimal 6 karakter"))).toBe(true);
    }
  });

  it("create_account=true: menerima email dengan spasi di depan/belakang — validasi ketat di client (spasi dianggap bukan whitespace kosong di regex)", () => {
    // Regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    // Email " budi@example.com " — spasi di awal/akhir dianggap karakter non-whitespace?
    // Spasi mengandung \s, jadi [^\s@] akan menolak spasi.
    // Jadi: email " budi@example.com" akan ditolak oleh regex karena diawali spasi.
    const result = formSchema.safeParse({
      full_name: "Budi Santoso",
      create_account: true,
      email: " budi@example.com ",
      password: "rahasia123",
      confirm_password: "rahasia123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const msgs = messagesForPath(result.error, "email");
      // Spasi di awal/akhir berarti email tidak lolos regex → "Format email tidak valid"
      expect(msgs.some((m) => m.includes("Format email tidak valid"))).toBe(true);
    }
  });

  // ── Edge cases tambahan ──

  it("create_account default ke false jika tidak disediakan", () => {
    // Saat create_account tidak diberikan, .default(false) harus aktif
    const result = formSchema.safeParse({
      full_name: "Budi Santoso",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.create_account).toBe(false);
    }
  });

  it("create_account=true: email valid dengan subdomain", () => {
    const result = formSchema.safeParse({
      full_name: "Budi Santoso",
      create_account: true,
      email: "budi@sma-negeri.sch.id",
      password: "rahasia123",
      confirm_password: "rahasia123",
    });
    expect(result.success).toBe(true);
  });

  it("create_account=true: menolak email tanpa domain (.tld)", () => {
    const result = formSchema.safeParse({
      full_name: "Budi Santoso",
      create_account: true,
      email: "budi@sma",
      password: "rahasia123",
      confirm_password: "rahasia123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const msgs = messagesForPath(result.error, "email");
      expect(msgs.some((m) => m.includes("Format email tidak valid"))).toBe(true);
    }
  });
});
