import { createRegexFromList } from './regex';

describe('createRegexFromList', () => {
  it('Matches the words in the list', () => {
    const regex = createRegexFromList(['Minimal', 'Mild', 'Moderate', 'Severe']);
    expect(regex.test('Minimal')).toBe(true);
    expect(regex.test('Mild')).toBe(true);
    expect(regex.test('Moderate')).toBe(true);
    expect(regex.test('Severe')).toBe(true);
  });

  it('Is case-insensitive', () => {
    const regex = createRegexFromList(['Minimal']);
    expect(regex.test('Minimal')).toBe(true);
    expect(regex.test('minimal')).toBe(true);
    expect(regex.test('MINIMAL')).toBe(true);
    expect(regex.test('MiNiMaL')).toBe(true);
  });

  it('Does not match other words', () => {
    const regex = createRegexFromList(['Minimal']);
    expect(regex.test('Mild')).toBe(false);
    expect(regex.test('Moderate')).toBe(false);
    expect(regex.test('Severe')).toBe(false);
  });

  it('Handles special regex characters', () => {
    const regex = createRegexFromList(['.*+?^${}()|[]\\']);
    expect(regex.test('.*+?^${}()|[]\\')).toBe(true);
  });

  it('Works with an empty list', () => {
    const regex = createRegexFromList([]);
    expect(regex.test('')).toBe(false);
    expect(regex.test('a^')).toBe(false);
  });

  it("Doesn't do partial matches", () => {
    const regex = createRegexFromList(['Minimal']);
    expect(regex.test('Mini')).toBe(false);
    expect(regex.test('ini')).toBe(false);
    expect(regex.test('Minimalist')).toBe(false);
    expect(regex.test('nimal')).toBe(false);
  });

  it('Whitespace is not ignored', () => {
    let regex = createRegexFromList(['Minimal']);
    expect(regex.test(' Minimal')).toBe(false);
    expect(regex.test('Minimal ')).toBe(false);
    expect(regex.test(' Minimal ')).toBe(false);

    // Included whitespace is preserved
    regex = createRegexFromList([' Minimal ']);
    expect(regex.test(' Minimal ')).toBe(true);
  });

  it('Works with single character strings', () => {
    const regex = createRegexFromList(['a', '*', '1']);
    expect(regex.test('a')).toBe(true);
    expect(regex.test('*')).toBe(true);
    expect(regex.test('1')).toBe(true);
    expect(regex.test('b')).toBe(false);
  });
});
