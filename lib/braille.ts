/**
 * Braille Utilities
 * Grade 1 English Braille (Uncontracted Braille)
 */

// Braille alphabet mapping (A-Z)
export const BRAILLE_ALPHABET: Record<string, string> = {
  a: "⠁",
  b: "⠃",
  c: "⠉",
  d: "⠙",
  e: "⠑",
  f: "⠋",
  g: "⠛",
  h: "⠓",
  i: "⠊",
  j: "⠚",
  k: "⠅",
  l: "⠇",
  m: "⠍",
  n: "⠝",
  o: "⠕",
  p: "⠏",
  q: "⠟",
  r: "⠗",
  s: "⠎",
  t: "⠞",
  u: "⠥",
  v: "⠧",
  w: "⠺",
  x: "⠭",
  y: "⠽",
  z: "⠵",
};

// Braille numbers (with number sign prefix)
export const BRAILLE_NUMBERS: Record<string, string> = {
  "0": "⠼⠚",
  "1": "⠼⠁",
  "2": "⠼⠃",
  "3": "⠼⠉",
  "4": "⠼⠙",
  "5": "⠼⠑",
  "6": "⠼⠋",
  "7": "⠼⠛",
  "8": "⠼⠓",
  "9": "⠼⠊",
};

// Braille punctuation
export const BRAILLE_PUNCTUATION: Record<string, string> = {
  ".": "⠲",
  ",": "⠂",
  "?": "⠦",
  "!": "⠖",
  ";": "⠆",
  ":": "⠒",
  "'": "⠄",
  '"': "⠦",
  "-": "⠤",
  "(": "⠐⠣",
  ")": "⠐⠜",
  "/": "⠸⠌",
  "@": "⠈⠁",
  "#": "⠼",
  "&": "⠈⠯",
  "*": "⠐⠔",
};

// Special indicators
export const BRAILLE_INDICATORS = {
  capital: "⠠", // Capital letter indicator
  number: "⠼", // Number indicator
  space: " ",
};

/**
 * Convert text to Braille
 */
export function textToBraille(text: string): string {
  if (!text) return "";

  let result = "";
  let inNumber = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const lowerChar = char.toLowerCase();

    // Handle space
    if (char === " ") {
      result += BRAILLE_INDICATORS.space;
      inNumber = false;
      continue;
    }

    // Handle uppercase letters
    if (char >= "A" && char <= "Z") {
      result += BRAILLE_INDICATORS.capital;
      result += BRAILLE_ALPHABET[lowerChar];
      inNumber = false;
      continue;
    }

    // Handle lowercase letters
    if (char >= "a" && char <= "z") {
      result += BRAILLE_ALPHABET[lowerChar];
      inNumber = false;
      continue;
    }

    // Handle numbers
    if (char >= "0" && char <= "9") {
      if (!inNumber) {
        result += BRAILLE_INDICATORS.number;
        inNumber = true;
      }
      // Use letter equivalents after number indicator
      const numberMap: Record<string, string> = {
        "1": "a", "2": "b", "3": "c", "4": "d", "5": "e",
        "6": "f", "7": "g", "8": "h", "9": "i", "0": "j",
      };
      result += BRAILLE_ALPHABET[numberMap[char]];
      continue;
    }

    // Handle punctuation
    if (BRAILLE_PUNCTUATION[char]) {
      result += BRAILLE_PUNCTUATION[char];
      inNumber = false;
      continue;
    }

    // Unknown character, keep as is
    result += char;
    inNumber = false;
  }

  return result;
}

/**
 * Convert Braille to text (reverse mapping)
 */
export function brailleToText(braille: string): string {
  if (!braille) return "";

  // Create reverse mappings
  const reverseAlphabet: Record<string, string> = {};
  Object.entries(BRAILLE_ALPHABET).forEach(([key, value]) => {
    reverseAlphabet[value] = key;
  });

  const reversePunctuation: Record<string, string> = {};
  Object.entries(BRAILLE_PUNCTUATION).forEach(([key, value]) => {
    reversePunctuation[value] = key;
  });

  let result = "";
  let nextCapital = false;
  let inNumber = false;

  for (let i = 0; i < braille.length; i++) {
    const char = braille[i];

    // Handle space
    if (char === " ") {
      result += " ";
      inNumber = false;
      continue;
    }

    // Handle capital indicator
    if (char === BRAILLE_INDICATORS.capital) {
      nextCapital = true;
      continue;
    }

    // Handle number indicator
    if (char === BRAILLE_INDICATORS.number) {
      inNumber = true;
      continue;
    }

    // Handle letters
    if (reverseAlphabet[char]) {
      let letter = reverseAlphabet[char];
      
      if (inNumber) {
        // Convert back to number
        const letterToNumber: Record<string, string> = {
          a: "1", b: "2", c: "3", d: "4", e: "5",
          f: "6", g: "7", h: "8", i: "9", j: "0",
        };
        result += letterToNumber[letter] || letter;
      } else {
        if (nextCapital) {
          letter = letter.toUpperCase();
          nextCapital = false;
        }
        result += letter;
      }
      continue;
    }

    // Handle punctuation
    if (reversePunctuation[char]) {
      result += reversePunctuation[char];
      inNumber = false;
      continue;
    }

    // Unknown Braille character
    result += "?";
  }

  return result;
}

/**
 * Get Braille dots pattern for a character
 */
export function getBrailleDots(char: string): string {
  const lowerChar = char.toLowerCase();
  
  const dotsMap: Record<string, string> = {
    a: "1", b: "1-2", c: "1-4", d: "1-4-5", e: "1-5",
    f: "1-2-4", g: "1-2-4-5", h: "1-2-5", i: "2-4", j: "2-4-5",
    k: "1-3", l: "1-2-3", m: "1-3-4", n: "1-3-4-5", o: "1-3-5",
    p: "1-2-3-4", q: "1-2-3-4-5", r: "1-2-3-5", s: "2-3-4", t: "2-3-4-5",
    u: "1-3-6", v: "1-2-3-6", w: "2-4-5-6", x: "1-3-4-6", y: "1-3-4-5-6",
    z: "1-3-5-6",
  };

  return dotsMap[lowerChar] || "";
}

/**
 * Validate if string contains valid Braille characters
 */
export function isValidBraille(text: string): boolean {
  const braillePattern = /^[\u2800-\u28FF\s]*$/;
  return braillePattern.test(text);
}

/**
 * Get full Braille alphabet reference
 */
export function getBrailleReference() {
  return {
    alphabet: Object.entries(BRAILLE_ALPHABET).map(([char, braille]) => ({
      char: char.toUpperCase(),
      braille,
      dots: getBrailleDots(char),
    })),
    numbers: Object.entries(BRAILLE_NUMBERS).map(([char, braille]) => ({
      char,
      braille,
    })),
    punctuation: Object.entries(BRAILLE_PUNCTUATION).map(([char, braille]) => ({
      char,
      braille,
    })),
  };
}