import { describe, it, expect } from "vitest";
import {
  textToBraille,
  brailleToText,
  getBrailleDots,
  isValidBraille,
  formatDotDescription,
  brailleCharToDescription,
  brailleStringToDescription,
  getBrailleReference,
  BRAILLE_ALPHABET,
  BRAILLE_NUMBERS,
  BRAILLE_PUNCTUATION,
  BRAILLE_INDICATORS,
} from "@/lib/braille";

describe("BRAILLE_ALPHABET", () => {
  it("memiliki 26 huruf A-Z", () => {
    expect(Object.keys(BRAILLE_ALPHABET)).toHaveLength(26);
  });

  it("memetakan 'a' ke ⠁", () => {
    expect(BRAILLE_ALPHABET["a"]).toBe("⠁");
  });

  it("memetakan 'z' ke ⠵", () => {
    expect(BRAILLE_ALPHABET["z"]).toBe("⠵");
  });
});

describe("BRAILLE_NUMBERS", () => {
  it("memiliki 10 digit 0-9", () => {
    expect(Object.keys(BRAILLE_NUMBERS)).toHaveLength(10);
  });

  it("semua angka diawali indikator angka ⠼", () => {
    for (const [_, braille] of Object.entries(BRAILLE_NUMBERS)) {
      expect(braille.startsWith(BRAILLE_INDICATORS.number)).toBe(true);
    }
  });

  it("angka 1 adalah ⠼⠁", () => {
    expect(BRAILLE_NUMBERS["1"]).toBe("⠼⠁");
  });
});

describe("BRAILLE_PUNCTUATION", () => {
  it("memiliki titik sebagai ⠲", () => {
    expect(BRAILLE_PUNCTUATION["."]).toBe("⠲");
  });

  it("memiliki koma sebagai ⠂", () => {
    expect(BRAILLE_PUNCTUATION[","]).toBe("⠂");
  });
});

describe("textToBraille", () => {
  it("mengembalikan string kosong untuk input kosong", () => {
    expect(textToBraille("")).toBe("");
  });

  it("mengubah huruf kecil ke Braille", () => {
    expect(textToBraille("a")).toBe("⠁");
    expect(textToBraille("hello")).toBe("⠓⠑⠇⠇⠕");
  });

  it("menambahkan indikator kapital untuk huruf besar", () => {
    expect(textToBraille("A")).toBe("⠠⠁");
    expect(textToBraille("Hello")).toBe("⠠⠓⠑⠇⠇⠕");
  });

  it("menangani spasi", () => {
    expect(textToBraille("a b")).toBe("⠁ ⠃");
  });

  it("menangani angka dengan indikator angka", () => {
    expect(textToBraille("123")).toBe("⠼⠁⠃⠉");
  });

  it("mematikan mode angka setelah spasi", () => {
    expect(textToBraille("1 a")).toBe("⠼⠁ ⠁");
  });

  it("menangani campuran huruf, angka, dan tanda baca", () => {
    expect(textToBraille("Hello, 123")).toBe("⠠⠓⠑⠇⠇⠕⠂ ⠼⠁⠃⠉");
  });

  it("mempertahankan karakter yang tidak dikenal", () => {
    expect(textToBraille("~")).toBe("~");
  });
});

describe("brailleToText", () => {
  it("mengembalikan string kosong untuk input kosong", () => {
    expect(brailleToText("")).toBe("");
  });

  it("mengubah Braille huruf kecil ke teks", () => {
    expect(brailleToText("⠓⠑⠇⠇⠕")).toBe("hello");
  });

  it("mengenali indikator kapital", () => {
    expect(brailleToText("⠠⠓")).toBe("H");
  });

  it("mengenali spasi", () => {
    expect(brailleToText("⠁ ⠃")).toBe("a b");
  });

  it("mengenali indikator angka", () => {
    expect(brailleToText("⠼⠁⠃⠉")).toBe("123");
  });

  it("mengubah karakter Braille tidak dikenal ke ?", () => {
    expect(brailleToText("⠀")).toBe("?");
  });

  it("roundtrip: text → Braille → text harus sama", () => {
    const original = "Hello World 123";
    const braille = textToBraille(original);
    const back = brailleToText(braille);
    expect(back).toBe(original);
  });
});

describe("getBrailleDots", () => {
  it("mengembalikan pola titik untuk 'a'", () => {
    expect(getBrailleDots("a")).toBe("1");
  });

  it("mengembalikan pola titik untuk 'p'", () => {
    expect(getBrailleDots("p")).toBe("1-2-3-4");
  });

  it("mengembalikan pola titik untuk 'g'", () => {
    expect(getBrailleDots("g")).toBe("1-2-4-5");
  });

  it("mengembalikan string kosong untuk karakter tidak dikenal", () => {
    expect(getBrailleDots("1")).toBe("");
  });

  it("case insensitive", () => {
    expect(getBrailleDots("A")).toBe("1");
    expect(getBrailleDots("a")).toBe("1");
  });
});

describe("isValidBraille", () => {
  it("mengembalikan true untuk string Braille valid", () => {
    expect(isValidBraille("⠓⠑⠇⠇⠕")).toBe(true);
  });

  it("mengembalikan true untuk spasi", () => {
    expect(isValidBraille("⠁ ⠃")).toBe(true);
  });

  it("mengembalikan false untuk teks biasa", () => {
    expect(isValidBraille("hello")).toBe(false);
  });

  it("mengembalikan true untuk string kosong", () => {
    expect(isValidBraille("")).toBe(true);
  });
});

describe("formatDotDescription", () => {
  it("format 1 titik: 'titik 1'", () => {
    expect(formatDotDescription("1")).toBe("titik 1");
  });

  it("format 2 titik: 'titik 1 dan 2'", () => {
    expect(formatDotDescription("1-2")).toBe("titik 1 dan 2");
  });

  it("format 3+ titik: 'titik 1, 2, dan 5'", () => {
    expect(formatDotDescription("1-2-5")).toBe("titik 1, 2, dan 5");
  });

  it("format 4 titik: 'titik 1, 2, 3, dan 4'", () => {
    expect(formatDotDescription("1-2-3-4")).toBe("titik 1, 2, 3, dan 4");
  });

  it("mengembalikan string kosong untuk input kosong", () => {
    expect(formatDotDescription("")).toBe("");
  });
});

describe("brailleCharToDescription", () => {
  it("mendeskripsikan spasi", () => {
    expect(brailleCharToDescription(" ")).toBe("spasi");
  });

  it("mendeskripsikan indikator kapital", () => {
    expect(brailleCharToDescription("⠠")).toBe("indikator huruf kapital, titik 6");
  });

  it("mendeskripsikan indikator angka", () => {
    expect(brailleCharToDescription("⠼")).toBe("indikator angka, titik 3, 4, 5, dan 6");
  });

  it("mendeskripsikan huruf Braille '⠓'", () => {
    expect(brailleCharToDescription("⠓")).toBe("H: titik 1, 2, dan 5");
  });

  it("mendeskripsikan huruf Braille '⠁'", () => {
    expect(brailleCharToDescription("⠁")).toBe("A: titik 1");
  });

  it("mendeskripsikan tanda baca Braille", () => {
    expect(brailleCharToDescription("⠲")).toBe("tanda titik");
    expect(brailleCharToDescription("⠂")).toBe("tanda koma");
  });

  it("mendeskripsikan karakter tidak dikenal", () => {
    expect(brailleCharToDescription("⠀")).toBe("karakter Braille tidak dikenal");
  });
});

describe("brailleStringToDescription", () => {
  it("mengembalikan string kosong untuk input kosong", () => {
    expect(brailleStringToDescription("")).toBe("");
  });

  it("mendeskripsikan string Braille multi-karakter", () => {
    expect(brailleStringToDescription("⠓⠊")).toBe("H: titik 1, 2, dan 5. I: titik 2 dan 4");
  });

  it("mendeskripsikan string dengan spasi", () => {
    expect(brailleStringToDescription("⠁ ⠃")).toBe("A: titik 1. spasi. B: titik 1 dan 2");
  });
});

describe("getBrailleReference", () => {
  it("mengembalikan referensi lengkap dengan alphabet, numbers, punctuation", () => {
    const ref = getBrailleReference();
    expect(ref.alphabet).toHaveLength(26);
    expect(ref.numbers).toHaveLength(10);
    expect(ref.punctuation.length).toBeGreaterThanOrEqual(8);
  });

  it("setiap alphabet memiliki char, braille, dots, description", () => {
    const ref = getBrailleReference();
    for (const item of ref.alphabet) {
      expect(item).toHaveProperty("char");
      expect(item).toHaveProperty("braille");
      expect(item).toHaveProperty("dots");
      expect(item).toHaveProperty("description");
    }
  });

  it("alphabet char pertama adalah A, braille ⠁, dots 1", () => {
    const ref = getBrailleReference();
    expect(ref.alphabet[0]).toEqual({
      char: "A",
      braille: "⠁",
      dots: "1",
      description: "titik 1",
    });
  });
});
