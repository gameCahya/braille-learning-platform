import { describe, it, expect } from "vitest";
import { toBraille } from "@/lib/data/modules/utils";

describe("toBraille (modules/utils)", () => {
  it("mengubah huruf kecil ke Braille", () => {
    expect(toBraille("hello")).toBe("⠓⠑⠇⠇⠕");
  });

  it("menambahkan indikator kapital untuk huruf besar", () => {
    expect(toBraille("Hello")).toBe("⠠⠓⠑⠇⠇⠕");
  });

  it("menambahkan indikator kapital hanya sekali untuk huruf besar berurutan", () => {
    expect(toBraille("HELLO")).toBe("⠠⠓⠑⠇⠇⠕");
  });

  it("menangani spasi dan reset kapital", () => {
    expect(toBraille("Hello World")).toBe("⠠⠓⠑⠇⠇⠕ ⠠⠺⠕⠗⠇⠙");
  });

  it("mempertahankan karakter non-huruf", () => {
    expect(toBraille("123!@#")).toBe("123!@#");
  });
});
