import { getUniqueIdentifierOptions } from './ReportFilters.utils';

describe('Report Filters utils', () => {
  describe('getUniqueIdentifierOptions', () => {
    test('should return an empty array for an empty identifiers array', () => {
      const result = getUniqueIdentifierOptions([]);
      expect(result).toEqual([]);
    });

    test('should return unique identifier options', () => {
      const identifiers = [
        { decryptedValue: 'decryptedValue_id1', encryptedValue: 'encryptedValue_id1' },
        { decryptedValue: 'decryptedValue_id2', encryptedValue: 'encryptedValue_id2' },
        { decryptedValue: 'decryptedValue_id2', encryptedValue: 'encryptedValue_id2' }, // duplicate
      ];

      const result = getUniqueIdentifierOptions(identifiers);
      expect(result).toEqual([
        { label: 'decryptedValue_id1', id: 'decryptedValue_id1' },
        { label: 'decryptedValue_id2', id: 'decryptedValue_id2' },
      ]);
    });
  });
});
