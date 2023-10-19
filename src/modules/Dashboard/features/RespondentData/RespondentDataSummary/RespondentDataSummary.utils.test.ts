import { getUniqueIdentifierOptions } from './RespondentDataSummary.utils';

describe('getUniqueIdentifierOptions', () => {
  it('should return an empty array for an empty identifiers array', () => {
    const result = getUniqueIdentifierOptions([]);
    expect(result).toEqual([]);
  });

  it('should return unique identifier options', () => {
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
