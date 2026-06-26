import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("menggabungkan class names sederhana", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("menangani class conditional (clsx)", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("me-merge Tailwind classes dengan twMerge (konflik)", () => {
    expect(cn("px-4", "px-2")).toBe("px-2");
  });

  it("me-merge Tailwind classes: padding yang berbeda", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("menangani array input", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("menangani object input", () => {
    expect(cn({ foo: true, bar: false })).toBe("foo");
  });
});
