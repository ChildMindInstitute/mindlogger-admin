import { getSelector } from './Item.utils';

describe('getSelector', () => {
  test.each`
    value1             | value2    | expected
    ${'abc'}           | ${'123'}  | ${'abc-123'}
    ${''}              | ${'xyz'}  | ${'-xyz'}
    ${'special-chars'} | ${'@!#%'} | ${'special-chars-@!#%'}
  `('should concatenate $value1 and $value2 to get $expected', ({ value1, value2, expected }) => {
    const result = getSelector(value1, value2);

    expect(result).toBe(expected);
  });
});
