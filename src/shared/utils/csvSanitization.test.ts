import { sanitizeCSVValue, sanitizeCSVObject, sanitizeCSVData, isCSVSafe } from './csvSanitization';

describe('CSV Sanitization', () => {
  describe('sanitizeCSVValue', () => {
    test('should handle null and undefined values', () => {
      expect(sanitizeCSVValue(null)).toBe('');
      expect(sanitizeCSVValue(undefined)).toBe('');
    });

    test('should handle empty strings', () => {
      expect(sanitizeCSVValue('')).toBe('');
    });

    test('should handle safe strings without modification', () => {
      expect(sanitizeCSVValue('safe text')).toBe('safe text');
      expect(sanitizeCSVValue('user@example.com')).toBe('user@example.com'); // @ not at start
      expect(sanitizeCSVValue('test-value')).toBe('test-value'); // - not at start
    });

    test('should sanitize dangerous characters at the start', () => {
      expect(sanitizeCSVValue('=SUM(A1:A10)')).toBe("'=SUM(A1:A10)");
      expect(sanitizeCSVValue('+1+2')).toBe("'+1+2");
      expect(sanitizeCSVValue('-5')).toBe("'-5");
      expect(sanitizeCSVValue('@malicious')).toBe("'@malicious");
      expect(sanitizeCSVValue('\ttest')).toBe("'\ttest");
      expect(sanitizeCSVValue('\rtest')).toBe("'\rtest");
    });

    test('should handle numbers', () => {
      expect(sanitizeCSVValue(123)).toBe('123');
      expect(sanitizeCSVValue(0)).toBe('0');
      expect(sanitizeCSVValue(-5)).toBe('-5'); // This should be sanitized since it starts with -
    });

    test('should handle boolean values', () => {
      expect(sanitizeCSVValue(true)).toBe('true');
      expect(sanitizeCSVValue(false)).toBe('false');
    });

    test('should handle complex formula injection attempts', () => {
      expect(sanitizeCSVValue('=cmd|"/c calc"!A0')).toBe('\'=cmd|"/c calc"!A0');
      expect(sanitizeCSVValue('=HYPERLINK("http://evil.com","Click me")')).toBe(
        '\'=HYPERLINK("http://evil.com","Click me")',
      );
      expect(sanitizeCSVValue('+cmd|"/c calc"!A0')).toBe('\'+cmd|"/c calc"!A0');
      expect(sanitizeCSVValue('-cmd|"/c calc"!A0')).toBe('\'-cmd|"/c calc"!A0');
      expect(sanitizeCSVValue('@SUM(1+1)*cmd|"/c calc"!A0')).toBe('\'@SUM(1+1)*cmd|"/c calc"!A0');
    });
  });

  describe('sanitizeCSVObject', () => {
    test('should sanitize string values in an object', () => {
      const input = {
        name: 'John Doe',
        formula: '=SUM(A1:A10)',
        email: 'user@example.com',
        dangerous: '+malicious',
        safe: 'normal text',
      };

      const result = sanitizeCSVObject(input);

      expect(result.name).toBe('John Doe');
      expect(result.formula).toBe("'=SUM(A1:A10)");
      expect(result.email).toBe('user@example.com');
      expect(result.dangerous).toBe("'+malicious");
      expect(result.safe).toBe('normal text');
    });

    test('should handle nested objects', () => {
      const input = {
        user: {
          name: 'Test User',
          malicious: '=EVIL()',
        },
        metadata: {
          count: 5,
          formula: '+dangerous',
        },
      };

      const result = sanitizeCSVObject(input);

      expect(result.user.name).toBe('Test User');
      expect(result.user.malicious).toBe("'=EVIL()");
      expect(result.metadata.count).toBe('5');
      expect(result.metadata.formula).toBe("'+dangerous");
    });

    test('should handle arrays and other types', () => {
      const input = {
        list: ['=formula', 'safe'],
        number: 42,
        boolean: true,
        nullValue: null,
        undefinedValue: undefined,
      };

      const result = sanitizeCSVObject(input);

      expect(result.list).toBe('=formula,safe'); // Arrays get stringified
      expect(result.number).toBe('42');
      expect(result.boolean).toBe('true');
      expect(result.nullValue).toBe('');
      expect(result.undefinedValue).toBe('');
    });
  });

  describe('sanitizeCSVData', () => {
    test('should sanitize array of objects', () => {
      const input = [
        {
          name: 'User 1',
          response: '=SUM(A1:A10)',
          email: 'user1@example.com',
        },
        {
          name: 'User 2',
          response: '+malicious_formula',
          email: 'user2@example.com',
        },
      ];

      const result = sanitizeCSVData(input);

      expect(result[0].name).toBe('User 1');
      expect(result[0].response).toBe("'=SUM(A1:A10)");
      expect(result[0].email).toBe('user1@example.com');

      expect(result[1].name).toBe('User 2');
      expect(result[1].response).toBe("'+malicious_formula");
      expect(result[1].email).toBe('user2@example.com');
    });

    test('should handle empty array', () => {
      expect(sanitizeCSVData([])).toEqual([]);
    });
  });

  describe('isCSVSafe', () => {
    test('should validate safe values', () => {
      expect(isCSVSafe('safe text')).toBe(true);
      expect(isCSVSafe('user@example.com')).toBe(true);
      expect(isCSVSafe('123')).toBe(true);
      expect(isCSVSafe('')).toBe(true);
      expect(isCSVSafe(null)).toBe(true);
      expect(isCSVSafe(undefined)).toBe(true);
    });

    test('should detect unsafe values', () => {
      expect(isCSVSafe('=SUM(A1:A10)')).toBe(false);
      expect(isCSVSafe('+malicious')).toBe(false);
      expect(isCSVSafe('-danger')).toBe(false);
      expect(isCSVSafe('@command')).toBe(false);
      expect(isCSVSafe('\ttab')).toBe(false);
      expect(isCSVSafe('\rreturn')).toBe(false);
    });

    test('should validate properly sanitized values', () => {
      expect(isCSVSafe("'=SUM(A1:A10)")).toBe(true);
      expect(isCSVSafe("'+malicious")).toBe(true);
      expect(isCSVSafe("'-danger")).toBe(true);
      expect(isCSVSafe("'@command")).toBe(true);
    });
  });

  describe('Real-world attack scenarios', () => {
    test('should prevent DDE (Dynamic Data Exchange) attacks', () => {
      const ddeAttack = '=cmd|"/c calc"!A1';
      expect(sanitizeCSVValue(ddeAttack)).toBe('\'=cmd|"/c calc"!A1');
      expect(isCSVSafe(sanitizeCSVValue(ddeAttack))).toBe(true);
    });

    test('should prevent hyperlink-based attacks', () => {
      const hyperlinkAttack = '=HYPERLINK("http://evil.com","Click me")';
      expect(sanitizeCSVValue(hyperlinkAttack)).toBe('\'=HYPERLINK("http://evil.com","Click me")');
      expect(isCSVSafe(sanitizeCSVValue(hyperlinkAttack))).toBe(true);
    });

    test('should prevent command execution via various prefixes', () => {
      const attacks = [
        '=cmd|"/c calc"!A0',
        '+cmd|"/c calc"!A0',
        '-cmd|"/c calc"!A0',
        '@SUM(1+1)*cmd|"/c calc"!A0',
      ];

      attacks.forEach((attack) => {
        const sanitized = sanitizeCSVValue(attack);
        expect(sanitized).toMatch(/^'/);
        expect(isCSVSafe(sanitized)).toBe(true);
      });
    });

    test('should handle realistic user data that might be dangerous', () => {
      const userInputs = [
        { name: 'John Doe', nickname: '=EVIL()' },
        { name: 'Jane Smith', tag: '+Administrator' },
        { name: 'Bob Wilson', response: '@dangerous_command' },
        { name: 'Alice Brown', comment: '-rm -rf /' },
      ];

      const sanitized = sanitizeCSVData(userInputs);

      expect(sanitized[0].nickname).toBe("'=EVIL()");
      expect(sanitized[1].tag).toBe("'+Administrator");
      expect(sanitized[2].response).toBe("'@dangerous_command");
      expect(sanitized[3].comment).toBe("'-rm -rf /");
    });
  });
});
