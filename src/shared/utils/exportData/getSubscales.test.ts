import { Sex, SubscaleTotalScore } from 'shared/consts';
import {
  mockedDecryptedAnswersWithSubscales,
  mockedSubscale1,
  mockedSubscale2,
  mockedSubscaleSetting,
  mockedTotalScoresTableData,
} from 'shared/mock';

import {
  getSubScaleScore,
  parseSex,
  calcScores,
  calcTotalScore,
  getSubscales,
} from './getSubscales';
import { getObjectFromList } from '../getObjectFromList';

const itemsAndSubscales = [mockedSubscale1, mockedSubscale2];
const itemsOnly = [mockedSubscale1];

const activityItems = getObjectFromList(
  mockedDecryptedAnswersWithSubscales,
  (item) => item.activityItem.name,
);
const subscaleItems = [
  {
    name: 'single',
    type: 'item',
  },
  {
    name: 'multi',
    type: 'item',
  },
  {
    name: 'slider',
    type: 'item',
  },
  {
    name: 'gender_screen',
    type: 'item',
  },
];
const subscaleWithoutTypeItems = subscaleItems.map((item) => ({ ...item, type: undefined }));

const data = {
  name: 'finalSubScale',
  items: subscaleItems,
  scoring: SubscaleTotalScore.Sum,
  subscaleTableData: null,
};

const subscaleObject = {
  'ss-1': mockedSubscale1,
  'ss-2': mockedSubscale2,
};

const itemsWithOptTextExpected = {
  [data.name]: { optionText: 'Description #2 for range 4~20', score: 5 },
};
const itemsWithoutOptTextExpected = {
  [data.name]: { optionText: '', score: 5 },
};
const emptyItemsWithOptTextExpected = {
  [data.name]: { optionText: 'Description #1 for range 0~4', score: 0 },
};
const emptyItemsWithoutOptTextExpected = {
  [data.name]: { optionText: '', score: 0 },
};
const itemsWithoutTypeExpected = {
  [data.name]: { optionText: 'Description #1 for range 0~4', score: 0 },
};
const filledSubscaleScores = {
  'Final SubScale Score': 5,
  'Optional text for Final SubScale Score': 'Description #2 for range 4~20',
  'ss-1': 5,
  'ss-2': 6,
};
const itemsOnlyfilledSubscaleScores = {
  'Final SubScale Score': 5,
  'Optional text for Final SubScale Score': 'Description #2 for range 4~20',
  'ss-1': 5,
};

describe('getSubscales', () => {
  describe('getSubScaleScore', () => {
    test.each`
      subscalesSum | type                          | length | expected
      ${5}         | ${SubscaleTotalScore.Sum}     | ${2}   | ${5}
      ${5}         | ${SubscaleTotalScore.Average} | ${2}   | ${2.5}
      ${5}         | ${SubscaleTotalScore.Average} | ${0}   | ${0}
    `(
      'returns "$expected" when subscalesSum="$subscalesSum", type="$type"',
      ({ subscalesSum, type, length, expected }) => {
        expect(getSubScaleScore(subscalesSum, type, length)).toBe(expected);
      },
    );
  });
  describe('parseSex', () => {
    test.each`
      sex          | expected
      ${Sex.M}     | ${'0'}
      ${Sex.F}     | ${'1'}
      ${''}        | ${'1'}
      ${undefined} | ${'1'}
      ${null}      | ${'1'}
    `('returns "$expected" when sex="$sex", type="$type"', ({ sex, expected }) => {
      expect(parseSex(sex)).toBe(expected);
    });
  });

  describe('calcScores', () => {
    test.each`
      subscaleItems               | subscaleTableData             | expected                            | description
      ${subscaleItems}            | ${mockedTotalScoresTableData} | ${itemsWithOptTextExpected}         | ${'should return score=5'}
      ${subscaleItems}            | ${null}                       | ${itemsWithoutOptTextExpected}      | ${'should return score=5 without opt text'}
      ${[]}                       | ${mockedTotalScoresTableData} | ${emptyItemsWithOptTextExpected}    | ${'should return score=0'}
      ${[]}                       | ${null}                       | ${emptyItemsWithoutOptTextExpected} | ${'should return score=0 without opt text'}
      ${subscaleWithoutTypeItems} | ${mockedTotalScoresTableData} | ${itemsWithoutTypeExpected}         | ${'should return score=0'}
    `('$description', ({ subscaleItems, subscaleTableData, expected }) => {
      const subscaleData = { ...data, subscaleTableData, items: subscaleItems };
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      expect(calcScores(subscaleData, activityItems, subscaleObject, {})).toEqual(expected);
    });
  });

  describe('calcTotalScore', () => {
    test.each`
      subscaleSetting          | activityItems    | expected                         | description
      ${mockedSubscaleSetting} | ${activityItems} | ${itemsWithOptTextExpected}      | ${'should return score=5'}
      ${mockedSubscaleSetting} | ${{}}            | ${emptyItemsWithOptTextExpected} | ${'should return score=0'}
      ${{}}                    | ${activityItems} | ${{}}                            | ${'should return empty object'}
      ${{}}                    | ${{}}            | ${{}}                            | ${'should return empty object'}
      ${null}                  | ${null}          | ${{}}                            | ${'should return empty object'}
    `('$description', ({ subscaleSetting, activityItems, expected }) => {
      expect(calcTotalScore(subscaleSetting, activityItems)).toEqual(expected);
    });
  });

  describe('getSubscales', () => {
    test.each`
      subscales            | activityItems    | expected                         | description
      ${itemsAndSubscales} | ${activityItems} | ${filledSubscaleScores}          | ${'should return filled scores: items and subscale'}
      ${itemsOnly}         | ${activityItems} | ${itemsOnlyfilledSubscaleScores} | ${'should return filled scores: items only'}
      ${itemsAndSubscales} | ${{}}            | ${{}}                            | ${'should return empty object'}
      ${{}}                | ${activityItems} | ${{}}                            | ${'should return empty object'}
      ${{}}                | ${{}}            | ${{}}                            | ${'should return empty object'}
      ${null}              | ${null}          | ${{}}                            | ${'should return empty object'}
    `('$description', ({ subscales, activityItems, expected }) => {
      const settings = {
        ...mockedSubscaleSetting,
        subscales,
      };
      expect(getSubscales(settings, activityItems)).toEqual(expected);
    });
  });
});
