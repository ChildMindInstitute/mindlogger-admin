import { sortItemsByOrder } from './sortItemsByOrder';

describe('sortItemsByOrder', () => {
  test.each([
    [null, null],
    [
      [{ order: 3 }, { order: 1 }, { order: 4 }, { order: 2 }],
      [{ order: 1 }, { order: 2 }, { order: 3 }, { order: 4 }],
    ],
    [
      [{ order: 3 }, { order: undefined }, { order: 1 }, { order: undefined }, { order: 2 }],
      [{ order: 1 }, { order: 2 }, { order: 3 }, { order: undefined }, { order: undefined }],
    ],
    [
      [{ order: 1 }, { order: 2 }, { order: 3 }],
      [{ order: 1 }, { order: 2 }, { order: 3 }],
    ],
    [
      [{ order: 2 }, { order: 1 }, { order: 3 }],
      [{ order: 1 }, { order: 2 }, { order: 3 }],
    ],
  ])('sorts items correctly', (input, expected) => {
    expect(sortItemsByOrder(input)).toEqual(expected);
  });
});
