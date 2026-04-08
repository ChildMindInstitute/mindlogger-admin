import { checkPassword } from './passwordValidation';

describe('checkPassword', () => {
  describe('hasUppercase', () => {
    it('returns true for ASCII uppercase', () => {
      expect(checkPassword('Hello').hasUppercase).toBe(true);
    });

    it('returns true for accented uppercase (É)', () => {
      expect(checkPassword('éÉ').hasUppercase).toBe(true);
    });

    it('returns false when no uppercase', () => {
      expect(checkPassword('hello123!').hasUppercase).toBe(false);
    });
  });

  describe('hasLowercase', () => {
    it('returns true for ASCII lowercase', () => {
      expect(checkPassword('Hello').hasLowercase).toBe(true);
    });

    it('returns true for accented lowercase (ñ)', () => {
      expect(checkPassword('Ññ').hasLowercase).toBe(true);
    });

    it('returns false when no lowercase', () => {
      expect(checkPassword('HELLO123!').hasLowercase).toBe(false);
    });
  });

  describe('hasDigit', () => {
    it('returns true for ASCII digit', () => {
      expect(checkPassword('abc1').hasDigit).toBe(true);
    });

    it('returns true for full-width digit (０)', () => {
      expect(checkPassword('abc０').hasDigit).toBe(true);
    });

    it('returns false when no digit', () => {
      expect(checkPassword('abcABC!').hasDigit).toBe(false);
    });
  });

  describe('hasSymbol', () => {
    it('returns true for common symbols', () => {
      expect(checkPassword('abc!').hasSymbol).toBe(true);
      expect(checkPassword('abc@').hasSymbol).toBe(true);
      expect(checkPassword('abc#').hasSymbol).toBe(true);
    });

    it('returns false when only letters and digits', () => {
      expect(checkPassword('abcABC123').hasSymbol).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(checkPassword('').hasSymbol).toBe(false);
    });
  });

  describe('hasNoSpaces', () => {
    it('returns true for no whitespace', () => {
      expect(checkPassword('abc123!').hasNoSpaces).toBe(true);
    });

    it('returns false for space', () => {
      expect(checkPassword('abc 123').hasNoSpaces).toBe(false);
    });

    it('returns false for tab', () => {
      expect(checkPassword('abc\t123').hasNoSpaces).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(checkPassword('').hasNoSpaces).toBe(false);
    });

    it('returns false for zero-width space (U+200B)', () => {
      expect(checkPassword('abc\u200B123').hasNoSpaces).toBe(false);
    });

    it('returns false for zero-width joiner (U+200D)', () => {
      expect(checkPassword('abc\u200D123').hasNoSpaces).toBe(false);
    });

    it('returns false for zero-width non-joiner (U+200C)', () => {
      expect(checkPassword('abc\u200C123').hasNoSpaces).toBe(false);
    });

    it('returns false for BOM / zero-width no-break space (U+FEFF)', () => {
      expect(checkPassword('abc\uFEFF123').hasNoSpaces).toBe(false);
    });

    it('returns false for soft hyphen (U+00AD)', () => {
      expect(checkPassword('abc\u00AD123').hasNoSpaces).toBe(false);
    });

    it('returns true for emoji (visible symbol)', () => {
      expect(checkPassword('abc😀123').hasNoSpaces).toBe(true);
    });

    it('returns false for Braille blank (U+2800)', () => {
      expect(checkPassword('abc\u2800123').hasNoSpaces).toBe(false);
    });

    it('returns false for Hangul filler (U+3164)', () => {
      expect(checkPassword('abc\u3164123').hasNoSpaces).toBe(false);
    });
  });

  describe('meetsLength', () => {
    it('returns false for 9 characters', () => {
      expect(checkPassword('123456789').meetsLength).toBe(false);
    });

    it('returns true for exactly 10 characters', () => {
      expect(checkPassword('1234567890').meetsLength).toBe(true);
    });

    it('returns true for more than 10 characters', () => {
      expect(checkPassword('12345678901').meetsLength).toBe(true);
    });

    it('returns false for empty string', () => {
      expect(checkPassword('').meetsLength).toBe(false);
    });

    it('counts emoji as 1 character, not 2 (surrogate pair)', () => {
      // 9 ASCII + 1 emoji = 10 code points but 11 UTF-16 code units
      expect(checkPassword('abcdefgh!😀').meetsLength).toBe(true);
    });

    it('does not over-count emoji for length', () => {
      // 8 ASCII + 1 emoji = 9 code points (below 10)
      expect(checkPassword('abcdefg!😀').meetsLength).toBe(false);
    });
  });

  describe('charTypeCount', () => {
    it('returns 0 for empty string', () => {
      expect(checkPassword('').charTypeCount).toBe(0);
    });

    it('returns 1 for lowercase only', () => {
      expect(checkPassword('abcdef').charTypeCount).toBe(1);
    });

    it('returns 2 for lowercase + digit', () => {
      expect(checkPassword('abc123').charTypeCount).toBe(2);
    });

    it('returns 3 for lowercase + uppercase + digit', () => {
      expect(checkPassword('abcABC123').charTypeCount).toBe(3);
    });

    it('returns 4 for all types', () => {
      expect(checkPassword('abcABC123!').charTypeCount).toBe(4);
    });

    it('counts accented characters correctly', () => {
      // É = uppercase, ñ = lowercase, ٣ = digit (Arabic-Indic), ! = symbol
      expect(checkPassword('Éñ٣!').charTypeCount).toBe(4);
    });
  });

  describe('meetsCharTypeRequirement', () => {
    it('returns false for 2 types (below threshold of 3)', () => {
      expect(checkPassword('abc123').meetsCharTypeRequirement).toBe(false);
    });

    it('returns true for exactly 3 types', () => {
      expect(checkPassword('abcABC123').meetsCharTypeRequirement).toBe(true);
    });

    it('returns true for all 4 types', () => {
      expect(checkPassword('abcABC123!').meetsCharTypeRequirement).toBe(true);
    });

    it('returns false for empty string', () => {
      expect(checkPassword('').meetsCharTypeRequirement).toBe(false);
    });
  });

  describe('NFC normalization', () => {
    // e + combining acute accent (U+0301) = NFD form of é
    const decomposedE = 'e\u0301';

    it('treats decomposed é as lowercase, not as lowercase + symbol', () => {
      const result = checkPassword(decomposedE);
      expect(result.hasLowercase).toBe(true);
      expect(result.hasSymbol).toBe(false);
    });

    it('counts decomposed é as 1 character (NFC), not 2 (NFD)', () => {
      // 10 decomposed é characters = 20 code units in NFD, but 10 after NFC
      const tenDecomposed = decomposedE.repeat(10);
      expect(checkPassword(tenDecomposed).meetsLength).toBe(true);
    });

    it('does not count decomposed É as a symbol', () => {
      // E + combining acute (U+0301) = NFD form of É
      const decomposedUpperE = 'E\u0301';
      const result = checkPassword(decomposedUpperE);
      expect(result.hasUppercase).toBe(true);
      expect(result.hasSymbol).toBe(false);
    });

    it('handles mixed NFC and NFD input correctly', () => {
      // NFC é + NFD Ñ (N + combining tilde U+0303) + digit + symbol
      const mixed = '\u00e9N\u03031!aaaaaaa';
      const result = checkPassword(mixed);
      expect(result.hasLowercase).toBe(true);
      expect(result.hasUppercase).toBe(true);
      expect(result.hasDigit).toBe(true);
      expect(result.hasSymbol).toBe(true);
      expect(result.charTypeCount).toBe(4);
    });
  });

  describe('caseless scripts (\\p{Lo})', () => {
    it('counts Japanese Kanji as both uppercase and lowercase', () => {
      const result = checkPassword('東京');
      expect(result.hasCaselessLetter).toBe(true);
      expect(result.hasUppercase).toBe(true);
      expect(result.hasLowercase).toBe(true);
    });

    it('counts Chinese characters as both uppercase and lowercase', () => {
      const result = checkPassword('漢字');
      expect(result.hasCaselessLetter).toBe(true);
      expect(result.hasUppercase).toBe(true);
      expect(result.hasLowercase).toBe(true);
    });

    it('counts Korean Hangul as both uppercase and lowercase', () => {
      const result = checkPassword('테스트');
      expect(result.hasCaselessLetter).toBe(true);
      expect(result.hasUppercase).toBe(true);
      expect(result.hasLowercase).toBe(true);
    });

    it('counts Arabic as both uppercase and lowercase', () => {
      const result = checkPassword('مرحبا');
      expect(result.hasCaselessLetter).toBe(true);
      expect(result.hasUppercase).toBe(true);
      expect(result.hasLowercase).toBe(true);
    });

    it('counts Hebrew as both uppercase and lowercase', () => {
      const result = checkPassword('שלום');
      expect(result.hasCaselessLetter).toBe(true);
      expect(result.hasUppercase).toBe(true);
      expect(result.hasLowercase).toBe(true);
    });

    it('meets char type requirement with caseless letters + digit (3 types)', () => {
      // CJK counts as upper+lower (2) + digit (1) = 3 types
      const result = checkPassword('東京太郎太郎太郎12');
      expect(result.charTypeCount).toBe(3);
      expect(result.meetsCharTypeRequirement).toBe(true);
    });

    it('meets char type requirement with caseless letters + symbol (3 types)', () => {
      // CJK counts as upper+lower (2) + symbol (1) = 3 types
      const result = checkPassword('東京太郎太郎太郎!@');
      expect(result.charTypeCount).toBe(3);
      expect(result.meetsCharTypeRequirement).toBe(true);
    });

    it('gets 4 types with caseless letters + digit + symbol', () => {
      const result = checkPassword('東京太郎太郎太1!');
      expect(result.charTypeCount).toBe(4);
      expect(result.meetsCharTypeRequirement).toBe(true);
    });

    it('only caseless letters = 2 types (upper+lower), below threshold', () => {
      const result = checkPassword('東京太郎太郎太郎太郎');
      expect(result.charTypeCount).toBe(2);
      expect(result.meetsCharTypeRequirement).toBe(false);
    });
  });
});
