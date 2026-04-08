// Unicode-aware patterns (the `u` flag enables \p{...} property escapes)
export const UPPERCASE_REGEXP = /\p{Lu}/u;
export const LOWERCASE_REGEXP = /\p{Ll}/u;
export const DIGIT_REGEXP = /\p{Nd}/u;
export const SYMBOL_REGEXP = /[^\p{L}\p{Nd}\s]/u;
export const NO_WHITESPACE_REGEXP = /^\S+$/u;
// Caseless scripts (CJK, Arabic, Hebrew, Korean, etc.) — letters with no upper/lower distinction
export const CASELESS_LETTER_REGEXP = /\p{Lo}/u;

export type PasswordCheckResult = {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasCaselessLetter: boolean;
  hasDigit: boolean;
  hasSymbol: boolean;
  hasNoSpaces: boolean;
  meetsLength: boolean;
  charTypeCount: number;
  meetsCharTypeRequirement: boolean;
};
