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
});
