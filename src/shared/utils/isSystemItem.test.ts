import { LookupTableItems } from 'shared/consts';

import { isSystemItem } from './isSystemItem';

describe('isSystemItem', () => {
  test.each`
    name                              | expected | description
    ${LookupTableItems.Age_screen}    | ${true}  | ${'should return true when name is LookupTableItems.Age_screen'}
    ${LookupTableItems.Gender_screen} | ${true}  | ${'should return true when name is LookupTableItems.Gender_screen'}
    ${'name'}                         | ${false} | ${'should return false when name is not a system item'}
  `('$description', ({ name, expected }) => {
    expect(isSystemItem(name)).toEqual(expected);
  });
});
