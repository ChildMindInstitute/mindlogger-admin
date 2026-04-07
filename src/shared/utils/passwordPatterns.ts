// Unicode-aware patterns (the `u` flag enables \p{...} property escapes)
export const UPPERCASE_REGEXP = /\p{Lu}/u;
export const LOWERCASE_REGEXP = /\p{Ll}/u;
export const DIGIT_REGEXP = /\p{Nd}/u;
export const SYMBOL_REGEXP = /[^\p{L}\p{Nd}\s]/u;
export const NO_WHITESPACE_REGEXP = /^\S+$/u;

export type PasswordCheckResult = {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasDigit: boolean;
  hasSymbol: boolean;
  hasNoSpaces: boolean;
  meetsLength: boolean;
  charTypeCount: number;
  meetsCharTypeRequirement: boolean;
};
