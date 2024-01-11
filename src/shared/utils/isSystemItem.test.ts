import { LookupTableItems } from 'shared/consts';
import { ElementType } from 'shared/types';

import { isSystemItem } from './isSystemItem';

describe('isSystemItem', () => {
  test.each`
    name                              | allowEdit | expected | description
    ${LookupTableItems.Age_screen}    | ${true}   | ${false} | ${'should return false when name is LookupTableItems.Age_screen and item is editable'}
    ${LookupTableItems.Gender_screen} | ${true}   | ${false} | ${'should return false when name is LookupTableItems.Gender_screen and item is editable'}
    ${LookupTableItems.Age_screen}    | ${false}  | ${true}  | ${'should return true when name is LookupTableItems.Age_screen and item is not editable'}
    ${LookupTableItems.Gender_screen} | ${false}  | ${true}  | ${'should return true when name is LookupTableItems.Gender_screen and item is not editable'}
    ${'name'}                         | ${true}   | ${false} | ${'should return false when name is not a system item and item is editable'}
    ${'name'}                         | ${false}  | ${false} | ${'should return false when name is not a system item and item is not editable'}
  `('$description', ({ name, allowEdit, expected }) => {
    expect(isSystemItem({ name, allowEdit, type: ElementType.Item })).toEqual(expected);
  });
});
