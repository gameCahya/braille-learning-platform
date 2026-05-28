const BRAILLE_ALPHABET: Record<string, string> = {
  a: "⠁", b: "⠃", c: "⠉", d: "⠙", e: "⠑",
  f: "⠋", g: "⠛", h: "⠓", i: "⠊", j: "⠚",
  k: "⠅", l: "⠇", m: "⠍", n: "⠝", o: "⠕",
  p: "⠏", q: "⠟", r: "⠗", s: "⠎", t: "⠞",
  u: "⠥", v: "⠧", w: "⠺", x: "⠭", y: "⠽", z: "⠵",
};

export function toBraille(text: string): string {
  let result = "";
  let prevWasUpper = false;
  for (const ch of text) {
    if (ch >= "A" && ch <= "Z") {
      if (!prevWasUpper) result += "⠠";
      prevWasUpper = true;
      result += BRAILLE_ALPHABET[ch.toLowerCase()] || ch;
    } else if (ch >= "a" && ch <= "z") {
      prevWasUpper = false;
      result += BRAILLE_ALPHABET[ch] || ch;
    } else if (ch === " ") {
      prevWasUpper = false;
      result += " ";
    } else {
      prevWasUpper = false;
      result += ch;
    }
  }
  return result;
}
