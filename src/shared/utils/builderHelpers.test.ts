import { getEntityKey, getObjectFromList, getUniqueName } from './builderHelpers';

describe('getEntityKey', () => {
  it('should return the id when useIdFirst is true and id is present', () => {
    const entity = { id: '123', key: 'abc' };
    const result = getEntityKey(entity, true);
    expect(result).toBe('123');
  });

  it('should return the key when useIdFirst is true and id is not present', () => {
    const entity = { key: 'abc' };
    const result = getEntityKey(entity, true);
    expect(result).toBe('abc');
  });

  it('should return an empty string when useIdFirst is true and neither id nor key is present', () => {
    const entity = {};
    const result = getEntityKey(entity, true);
    expect(result).toBe('');
  });

  it('should return the key when useIdFirst is false and key is present', () => {
    const entity = { id: '123', key: 'abc' };
    const result = getEntityKey(entity, false);
    expect(result).toBe('abc');
  });

  it('should return the id when useIdFirst is true and id is present, even if key is falsy', () => {
    const entity = { id: '123', key: '' };
    const result = getEntityKey(entity, true);
    expect(result).toBe('123');
  });

  it('should return the key when useIdFirst is false and key is present, even if id is falsy', () => {
    const entity = { id: '', key: 'abc' };
    const result = getEntityKey(entity, false);
    expect(result).toBe('abc');
  });

  it('should return an empty string when both id and key are falsy, regardless of useIdFirst', () => {
    const entity = { id: '', key: '' };
    const resultIdFirst = getEntityKey(entity, true);
    const resultKeyFirst = getEntityKey(entity, false);
    expect(resultIdFirst).toBe('');
    expect(resultKeyFirst).toBe('');
  });
});

describe('getObjectFromList', () => {
  it('should return an empty object when items array is empty', () => {
    const result = getObjectFromList([]);
    expect(result).toEqual({});
  });

  it('should create an object with unique keys based on ids by default', () => {
    const items = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ];
    const result = getObjectFromList(items);
    expect(result).toEqual({
      '1': { id: '1', name: 'Item 1' },
      '2': { id: '2', name: 'Item 2' },
    });
  });

  it('should create an object with unique keys based on a custom key function', () => {
    const items = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ];
    const result = getObjectFromList(items, (item) => item.name);
    expect(result).toEqual({
      'Item 1': { id: '1', name: 'Item 1' },
      'Item 2': { id: '2', name: 'Item 2' },
    });
  });

  // Add more test cases to cover various scenarios
});

describe('getUniqueName', () => {
  it('should return the original name when it is unique', () => {
    const result = getUniqueName({ name: 'UniqueName', existingNames: ['OtherName'] });
    expect(result).toBe('UniqueName');
  });

  it('should append index in parentheses when the name already exists', () => {
    const result = getUniqueName({ name: 'ExistingName', existingNames: ['ExistingName'] });
    expect(result).toBe('ExistingName (1)');
  });

  it('should append index with underscore when withUnderscore is true', () => {
    const result = getUniqueName({
      name: 'ExistingName',
      existingNames: ['ExistingName', 'ExistingName_1'],
      withUnderscore: true,
    });
    expect(result).toBe('ExistingName_2');
  });

  // Add more test cases to cover various scenarios
});
