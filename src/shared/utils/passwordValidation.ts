import { ACCOUNT_PASSWORD_MIN_LENGTH, ACCOUNT_PASSWORD_MIN_CHAR_TYPES } from 'shared/consts';

import {
  UPPERCASE_REGEXP,
  LOWERCASE_REGEXP,
  DIGIT_REGEXP,
  SYMBOL_REGEXP,
  VISIBLE_ONLY_REGEXP,
  HIDDEN_BLANKS_REGEXP,
  CASELESS_LETTER_REGEXP,
  type PasswordCheckResult,
} from './passwordPatterns';

export type { PasswordCheckResult };

// Count user-perceived characters (grapheme clusters), so each emoji = 1.
const graphemeLength = (str: string): number => [...new Intl.Segmenter().segment(str)].length;

export const checkPassword = (
  password: string,
  minLength: number = ACCOUNT_PASSWORD_MIN_LENGTH,
): PasswordCheckResult => {
  const normalized = password.normalize('NFKC');
  const hasCaselessLetter = CASELESS_LETTER_REGEXP.test(normalized);
  const hasUppercase = UPPERCASE_REGEXP.test(normalized) || hasCaselessLetter;
  const hasLowercase = LOWERCASE_REGEXP.test(normalized) || hasCaselessLetter;
  const hasDigit = DIGIT_REGEXP.test(normalized);
  const hasSymbol = SYMBOL_REGEXP.test(normalized);
  const charTypeCount = [hasUppercase, hasLowercase, hasDigit, hasSymbol].filter(Boolean).length;

  return {
    hasUppercase,
    hasLowercase,
    hasCaselessLetter,
    hasDigit,
    hasSymbol,
    hasNoSpaces: VISIBLE_ONLY_REGEXP.test(normalized) && !HIDDEN_BLANKS_REGEXP.test(normalized),
    meetsLength: graphemeLength(normalized) >= minLength,
    charTypeCount,
    meetsCharTypeRequirement: charTypeCount >= ACCOUNT_PASSWORD_MIN_CHAR_TYPES,
  };
};

export const isAccountPasswordPolicySatisfied = (result: PasswordCheckResult): boolean => {
  return result.meetsLength && result.hasNoSpaces && result.meetsCharTypeRequirement;
};
