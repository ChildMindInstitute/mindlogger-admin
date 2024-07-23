import { checkAllNumericContradictions } from './checkAllNumericContradictions';

describe('checkAllNumericContradictions', () => {
  test.each([
    [
      '"greaterThanValue" and "lessThanValue" contradiction (failed)',
      {
        lessThanValue: 5,
        greaterThanValue: 4,
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"greaterThanValue" and "lessThanValue" contradiction (failed)',
      {
        lessThanValue: 3,
        greaterThanValue: 4,
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"greaterThanValue" and "lessThanValue" contradiction (failed)',
      {
        lessThanValue: 4,
        greaterThanValue: 4,
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"greaterThanValue" and "lessThanValue" contradiction (failed)',
      {
        lessThanValue: 10,
        greaterThanValue: 9,
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"greaterThanValue" and "lessThanValue" contradiction (failed)',
      {
        lessThanValue: 3,
        greaterThanValue: 3,
        minValue: 1,
        maxValue: 3,
      },
      true,
    ],
    [
      '"greaterThanValue" and "lessThanValue" contradiction (successful)',
      {
        lessThanValue: 7,
        greaterThanValue: 4,
        minValue: 0,
        maxValue: 10,
      },
      false,
    ],
    [
      '"greaterThanValue" and "isEqualTo" contradiction (failed)',
      {
        greaterThanValue: 9,
        equalSetUnion: [10, 7],
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"greaterThanValue" and "isEqualTo" contradiction (failed)',
      {
        greaterThanValue: 7,
        equalSetUnion: [1, 7],
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"greaterThanValue" and "isEqualTo" contradiction (successful)',
      {
        greaterThanValue: 9,
        equalSetUnion: [10],
        minValue: 0,
        maxValue: 10,
      },
      false,
    ],
    [
      '"greaterThanValue" and "isNotEqualTo" contradiction (failed)',
      {
        greaterThanValue: 8,
        notEqualSetUnion: [9, 10],
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"greaterThanValue" and "isNotEqualTo" contradiction (successful)',
      {
        greaterThanValue: 5,
        notEqualSetUnion: [9, 10],
        minValue: 0,
        maxValue: 10,
      },
      false,
    ],
    [
      '"greaterThanValue" and "betweenValues" contradiction (failed)',
      {
        greaterThanValue: 8,
        betweenUnion: [1, 9],
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"greaterThanValue" and "betweenValues" contradiction (successful)',
      {
        greaterThanValue: 5,
        betweenUnion: [1, 7],
        minValue: 0,
        maxValue: 10,
      },
      false,
    ],
    [
      '"greaterThanValue" and "outsideOfValues" contradiction (failed)',
      {
        greaterThanValue: 8,
        outsideOfUnion: [7, 10],
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"greaterThanValue" and "outsideOfValues" contradiction (successful)',
      {
        greaterThanValue: 5,
        outsideOfUnion: [1, 9],
        minValue: 0,
        maxValue: 10,
      },
      false,
    ],
    [
      '"lessThanValue" and "isEqualTo" contradiction (failed)',
      {
        lessThanValue: 8,
        equalSetUnion: [8],
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"lessThanValue" and "isEqualTo" contradiction (successful)',
      {
        lessThanValue: 5,
        equalSetUnion: [4],
        minValue: 0,
        maxValue: 10,
      },
      false,
    ],
    [
      '"lessThanValue" and "isNotEqualTo" contradiction (failed)',
      {
        lessThanValue: 2,
        notEqualSetUnion: [1, 0],
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"lessThanValue" and "isNotEqualTo" contradiction (successful)',
      {
        lessThanValue: 5,
        notEqualSetUnion: [4, 10],
        minValue: 0,
        maxValue: 10,
      },
      false,
    ],
    [
      '"lessThanValue" and "betweenValues" contradiction (failed)',
      {
        lessThanValue: 8,
        betweenUnion: [7, 10],
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"lessThanValue" and "betweenValues" contradiction (successful)',
      {
        lessThanValue: 5,
        betweenUnion: [1, 6],
        minValue: 0,
        maxValue: 10,
      },
      false,
    ],
    [
      '"lessThanValue" and "outsideOfValues" contradiction (failed)',
      {
        lessThanValue: 8,
        outsideOfUnion: [0, 7],
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"lessThanValue" and "outsideOfValues" contradiction (successful)',
      {
        lessThanValue: 6,
        outsideOfUnion: [1, 9],
        minValue: 0,
        maxValue: 10,
      },
      false,
    ],
    [
      '"equalTo" contradiction (failed)',
      {
        equalSetUnion: [0, 7, 3],
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"equalTo" contradiction (successful)',
      {
        equalSetUnion: [1, 1],
        minValue: 0,
        maxValue: 10,
      },
      false,
    ],
    [
      '"equalTo" and "isNotEqualTo" contradiction (failed)',
      {
        equalSetUnion: [0],
        notEqualSetUnion: [1, 0, 5],
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"equalTo" and "isNotEqualTo" contradiction (successful)',
      {
        equalSetUnion: [1],
        notEqualSetUnion: [2, 4],
        minValue: 0,
        maxValue: 10,
      },
      false,
    ],
    [
      '"equalTo" and "betweenValues" contradiction (failed)',
      {
        equalSetUnion: [0],
        betweenUnion: [0, 5],
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"equalTo" and "betweenValues" contradiction (failed)',
      {
        equalSetUnion: [8],
        betweenUnion: [0, 5],
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"equalTo" and "betweenValues" contradiction (successful)',
      {
        equalSetUnion: [3],
        betweenUnion: [2, 4],
        minValue: 0,
        maxValue: 10,
      },
      false,
    ],
    [
      '"equalTo" and "outsideValues" contradiction (failed)',
      {
        equalSetUnion: [2],
        outsideOfUnion: [0, 5],
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"equalTo" and "outsideValues" contradiction (successful)',
      {
        equalSetUnion: [5],
        outsideOfUnion: [2, 4],
        minValue: 0,
        maxValue: 10,
      },
      false,
    ],
    [
      '"isNotEqualTo" and "betweenValues" contradiction (failed)',
      {
        notEqualSetUnion: [2, 3, 4, 6],
        betweenUnion: [1, 5],
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"isNotEqualTo" and "betweenValues" contradiction (successful)',
      {
        notEqualSetUnion: [5, 6, 4, 1],
        betweenUnion: [2, 4],
        minValue: 0,
        maxValue: 10,
      },
      false,
    ],
    [
      '"isNotEqualTo" and "outsideValues" contradiction (failed)',
      {
        notEqualSetUnion: [0, 10],
        outsideOfUnion: [1, 9],
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"isNotEqualTo" and "outsideValues" contradiction (successful)',
      {
        notEqualSetUnion: [5, 6, 4, 1],
        outsideOfUnion: [2, 8],
        minValue: 0,
        maxValue: 10,
      },
      false,
    ],
    [
      '"between" and "outsideValues" contradiction (failed)',
      {
        betweenUnion: [5, 10],
        outsideOfUnion: [6, 9],
        minValue: 0,
        maxValue: 10,
      },
      true,
    ],
    [
      '"between" and "outsideValues" contradiction (successful)',
      {
        betweenUnion: [5, 9],
        outsideOfUnion: [8, 10],
        minValue: 0,
        maxValue: 10,
      },
      false,
    ],
  ])('%s', (_, props, expected) => {
    expect(checkAllNumericContradictions(props)).toBe(expected);
  });
});
