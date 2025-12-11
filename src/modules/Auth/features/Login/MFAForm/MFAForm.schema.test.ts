import { mfaFormSchema, recoveryCodeSchema } from './MFAForm.schema';

// Mock i18n to return translation keys instead of translated text
vi.mock('i18n', () => ({
  default: {
    t: (key: string) => key,
  },
}));

describe('MFA Form Schemas', () => {
  describe('mfaFormSchema', () => {
    it('validates valid 6-digit code', async () => {
      const schema = mfaFormSchema();
      const validCodes = ['123456', '000000', '999999', '012345'];

      for (const code of validCodes) {
        const result = await schema.isValid({ totpCode: code });
        expect(result).toBe(true);
      }
    });

    it('rejects invalid codes', async () => {
      const schema = mfaFormSchema();
      const invalidCodes = [
        '', // empty
        '12345', // too short
        '1234567', // too long
        'abcdef', // letters
        '12 456', // space
        '123-456', // special character
        '12345a', // mixed
      ];

      for (const code of invalidCodes) {
        const result = await schema.isValid({ totpCode: code });
        expect(result).toBe(false);
      }
    });

    it('returns correct error messages', async () => {
      const schema = mfaFormSchema();

      // Test required error
      try {
        await schema.validate({ totpCode: '' });
        expect(true).toBe(false); // Should not reach here
      } catch (error: any) {
        expect(error.message).toBe('mfaCodeRequired');
      }

      // Test format error
      try {
        await schema.validate({ totpCode: '12345' });
        expect(true).toBe(false); // Should not reach here
      } catch (error: any) {
        expect(error.message).toBe('mfaCodeFormat');
      }
    });

    it('strips unknown fields', async () => {
      const schema = mfaFormSchema();
      const data = {
        totpCode: '123456',
        extraField: 'should be removed',
      };

      const result = await schema.strip().validate(data);
      expect(result).toEqual({ totpCode: '123456' });
      expect(result).not.toHaveProperty('extraField');
    });
  });

  describe('recoveryCodeSchema', () => {
    it('validates valid recovery codes', async () => {
      const schema = recoveryCodeSchema();
      const validCodes = ['ABCDE-12345', 'A1B2C-3D4E5', '00000-00000', 'ZZZZZ-99999'];

      for (const code of validCodes) {
        const result = await schema.isValid({ code });
        expect(result).toBe(true);
      }
    });

    it('rejects invalid recovery codes', async () => {
      const schema = recoveryCodeSchema();
      const invalidCodes = [
        '', // empty
        'ABCDE12345', // no hyphen
        'ABCDE-1234', // too short after hyphen
        'ABCD-12345', // too short before hyphen
        'ABCDE-123456', // too long after hyphen
        'ABCDEF-12345', // too long before hyphen
        'abcde-12345', // lowercase
        'ABCDE_12345', // wrong separator
        'ABCDE 12345', // space separator
        '!@#$%-12345', // special characters
      ];

      for (const code of invalidCodes) {
        const result = await schema.isValid({ code });
        expect(result).toBe(false);
      }
    });

    it('returns correct error messages', async () => {
      const schema = recoveryCodeSchema();

      // Test required error
      try {
        await schema.validate({ code: '' });
        expect(true).toBe(false); // Should not reach here
      } catch (error: any) {
        expect(error.message).toBe('recoveryCodeRequired');
      }

      // Test format error
      try {
        await schema.validate({ code: 'INVALID' });
        expect(true).toBe(false); // Should not reach here
      } catch (error: any) {
        expect(error.message).toBe('recoveryCodeFormat');
      }
    });

    it('strips unknown fields', async () => {
      const schema = recoveryCodeSchema();
      const data = {
        code: 'ABCDE-12345',
        extraField: 'should be removed',
        anotherField: 123,
      };

      const result = await schema.strip().validate(data);
      expect(result).toEqual({ code: 'ABCDE-12345' });
      expect(result).not.toHaveProperty('extraField');
      expect(result).not.toHaveProperty('anotherField');
    });

    it('preserves exact format of valid codes', async () => {
      const schema = recoveryCodeSchema();
      const codes = ['ABCDE-12345', 'A0B0C-0D0E0'];

      for (const code of codes) {
        const result = await schema.validate({ code });
        expect(result.code).toBe(code); // Should not transform the code
      }
    });
  });
});
