import { Sex, SubscaleTotalScore } from 'shared/consts';
import {
  mockedDecryptedAnswersWithSubscales,
  mockedSubscale1,
  mockedSubscale2,
  mockedSubscaleSetting,
  mockedTotalScoresTableData,
} from 'shared/mock';
import { ItemResponseType } from 'shared/consts';

import {
  getSubscaleScore,
  parseSex,
  calcScores,
  calcTotalScore,
  getSubscales,
} from './getSubscales';
import { getObjectFromList } from '../getObjectFromList';

const itemsAndSubscales = [mockedSubscale1, mockedSubscale2];
const itemsAndSubscalesWithAverageCalculation = [
  { ...mockedSubscale1, scoring: SubscaleTotalScore.Average },
];
const itemsOnly = [mockedSubscale1];

const activityItems = getObjectFromList(
  mockedDecryptedAnswersWithSubscales,
  (item) => item.activityItem.name,
);
const activityItemsWithoutHiddenItems = getObjectFromList(
  mockedDecryptedAnswersWithSubscales.filter(
    (answer) =>
      answer.activityItem.responseType !== ItemResponseType.SingleSelection &&
      answer.activityItem.responseType !== ItemResponseType.MultipleSelection,
  ),
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

const mockedSubscaleSettingWithAverageCalculation = {
  ...mockedSubscaleSetting,
  calculateTotalScore: SubscaleTotalScore.Average,
};
const itemsWithOptTextExpected = {
  [data.name]: { optionText: 'Description #2 for range 4~20', score: 5, severity: null },
};
const itemsWithOptTextWithAverageCalculationExpected = {
  [data.name]: { optionText: 'Description #1 for range 0~4', score: 1.67, severity: null },
};
const itemsWithoutOptTextExpected = {
  [data.name]: { optionText: '', score: 5, severity: null },
};

const itemsWithSingleAndMultiHiddenWithOptTextExpected = {
  [data.name]: { optionText: 'Description #1 for range 0~4', score: 3, severity: null },
};
const itemsWithSingleAndMultiHiddenWithoutOptTextExpected = {
  [data.name]: { optionText: '', score: 3, severity: null },
};

const emptyItemsWithOptTextExpected = {
  [data.name]: { optionText: 'Description #1 for range 0~4', score: 0, severity: null },
};
const emptyItemsWithoutOptTextExpected = {
  [data.name]: { optionText: '', score: 0, severity: null },
};
const itemsWithoutTypeExpected = {
  [data.name]: { optionText: 'Description #1 for range 0~4', score: 0, severity: null },
};
const legacyFilledSubscaleScores = {
  'Final SubScale Score': 5,
  'Optional text for Final SubScale Score': 'Description #2 for range 4~20',
  'ss-1': 5,
  'ss-2': 6,
};
const legacyFilledSubscaleScoresWithAverageCalculation = {
  'Final SubScale Score': 5,
  'Optional text for Final SubScale Score': 'Description #2 for range 4~20',
  'ss-1': 1.67,
};
const itemsOnlyLegacyFilledSubscaleScores = {
  'Final SubScale Score': 5,
  'Optional text for Final SubScale Score': 'Description #2 for range 4~20',
  'ss-1': 5,
};
const filledSubscaleScores = {
  activity_score: 5,
  activity_score_lookup_text: 'Description #2 for range 4~20',
  'subscale_name_ss-1': 5,
  'subscale_name_ss-2': 6,
};
const filledSubscaleScoresWithAverageCalculation = {
  activity_score: 5,
  activity_score_lookup_text: 'Description #2 for range 4~20',
  'subscale_name_ss-1': 1.67,
};
const itemsOnlyFilledSubscaleScores = {
  activity_score: 5,
  activity_score_lookup_text: 'Description #2 for range 4~20',
  'subscale_name_ss-1': 5,
};

describe('getSubscales', () => {
  describe('getSubScaleScore', () => {
    test.each`
      subscalesSum | type                          | length | expected
      ${5}         | ${SubscaleTotalScore.Sum}     | ${2}   | ${5}
      ${5}         | ${SubscaleTotalScore.Average} | ${2}   | ${2.5}
      ${5}         | ${SubscaleTotalScore.Average} | ${3}   | ${1.67}
      ${5}         | ${SubscaleTotalScore.Average} | ${0}   | ${0}
    `(
      'returns "$expected" when subscalesSum="$subscalesSum", type="$type"',
      ({ subscalesSum, type, length, expected }) => {
        expect(getSubscaleScore(subscalesSum, type, length)).toBe(expected);
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
    const mockLookupTableWithSeverity = [
      {
        score: '10',
        rawScore: '5',
        age: '25',
        sex: null,
        optionalText: 'Awesome text',
        severity: 'Mild',
      },
    ];

    const itemsWithSeverityExpected = {
      [data.name]: { optionText: 'Awesome text', score: 10, severity: 'Mild' },
    };

    test.each`
      subscaleItems               | subscaleTableData              | expected                            | description
      ${subscaleItems}            | ${mockedTotalScoresTableData}  | ${itemsWithOptTextExpected}         | ${'should return score=5'}
      ${subscaleItems}            | ${mockLookupTableWithSeverity} | ${itemsWithSeverityExpected}        | ${'should return score=10 with severity'}
      ${subscaleItems}            | ${null}                        | ${itemsWithoutOptTextExpected}      | ${'should return score=5 without opt text'}
      ${[]}                       | ${mockedTotalScoresTableData}  | ${emptyItemsWithOptTextExpected}    | ${'should return score=0'}
      ${[]}                       | ${null}                        | ${emptyItemsWithoutOptTextExpected} | ${'should return score=0 without opt text'}
      ${subscaleWithoutTypeItems} | ${mockedTotalScoresTableData}  | ${itemsWithoutTypeExpected}         | ${'should return score=0'}
    `('$description', ({ subscaleItems, subscaleTableData, expected }) => {
      const subscaleData = { ...data, subscaleTableData, items: subscaleItems };
      expect(
        calcScores(subscaleData, activityItems, subscaleObject, {
          enableSubscaleNullWhenSkipped: false,
        }),
      ).toEqual(expected);
    });
  });

  describe('calcScores with hidden items', () => {
    test.each`
      subscaleItems               | subscaleTableData             | expected                                               | description
      ${subscaleItems}            | ${mockedTotalScoresTableData} | ${itemsWithSingleAndMultiHiddenWithOptTextExpected}    | ${'should return score=3'}
      ${subscaleItems}            | ${null}                       | ${itemsWithSingleAndMultiHiddenWithoutOptTextExpected} | ${'should return score=3 without opt text'}
      ${[]}                       | ${mockedTotalScoresTableData} | ${emptyItemsWithOptTextExpected}                       | ${'should return score=0'}
      ${[]}                       | ${null}                       | ${emptyItemsWithoutOptTextExpected}                    | ${'should return score=0 without opt text'}
      ${subscaleWithoutTypeItems} | ${mockedTotalScoresTableData} | ${itemsWithoutTypeExpected}                            | ${'should return score=0'}
    `('$description', ({ subscaleItems, subscaleTableData, expected }) => {
      const subscaleData = { ...data, subscaleTableData, items: subscaleItems };
      expect(
        calcScores(subscaleData, activityItemsWithoutHiddenItems, subscaleObject, {
          enableSubscaleNullWhenSkipped: false,
        }),
      ).toEqual(expected);
    });
  });

  describe('calcTotalScore', () => {
    test.each`
      subscaleSetting                                | activityItems    | expected                                          | description
      ${mockedSubscaleSetting}                       | ${activityItems} | ${itemsWithOptTextExpected}                       | ${'should return score=5'}
      ${mockedSubscaleSettingWithAverageCalculation} | ${activityItems} | ${itemsWithOptTextWithAverageCalculationExpected} | ${'should return score=1.67'}
      ${mockedSubscaleSetting}                       | ${{}}            | ${emptyItemsWithOptTextExpected}                  | ${'should return score=0'}
      ${{}}                                          | ${activityItems} | ${{}}                                             | ${'should return empty object'}
      ${{}}                                          | ${{}}            | ${{}}                                             | ${'should return empty object'}
      ${null}                                        | ${null}          | ${{}}                                             | ${'should return empty object'}
    `('$description', ({ subscaleSetting, activityItems, expected }) => {
      expect(
        calcTotalScore(subscaleSetting, activityItems, {
          enableDataExportRenaming: false,
          enableSubscaleNullWhenSkipped: false,
        }),
      ).toEqual(expected);
    });
  });

  describe('getSubscales (legacy naming)', () => {
    test.each`
      subscales                                  | activityItems    | expected                                            | description
      ${itemsAndSubscales}                       | ${activityItems} | ${legacyFilledSubscaleScores}                       | ${'should return filled scores: items and subscale'}
      ${itemsAndSubscalesWithAverageCalculation} | ${activityItems} | ${legacyFilledSubscaleScoresWithAverageCalculation} | ${'should return filled scores with average calculation: items and subscale'}
      ${itemsOnly}                               | ${activityItems} | ${itemsOnlyLegacyFilledSubscaleScores}              | ${'should return filled scores: items only'}
      ${itemsAndSubscales}                       | ${{}}            | ${{}}                                               | ${'should return empty object'}
      ${{}}                                      | ${activityItems} | ${{}}                                               | ${'should return empty object'}
      ${{}}                                      | ${{}}            | ${{}}                                               | ${'should return empty object'}
      ${null}                                    | ${null}          | ${{}}                                               | ${'should return empty object'}
    `('$description', ({ subscales, activityItems, expected }) => {
      const settings = {
        ...mockedSubscaleSetting,
        subscales,
      };
      expect(
        getSubscales(settings, activityItems, {
          enableDataExportRenaming: false,
          enableSubscaleNullWhenSkipped: false,
        }),
      ).toEqual(expected);
    });
  });

  describe('getSubscales (new naming)', () => {
    test.each`
      subscales                                  | activityItems    | expected                                      | description
      ${itemsAndSubscales}                       | ${activityItems} | ${filledSubscaleScores}                       | ${'should return filled scores: items and subscale'}
      ${itemsAndSubscalesWithAverageCalculation} | ${activityItems} | ${filledSubscaleScoresWithAverageCalculation} | ${'should return filled scores with average calculation: items and subscale'}
      ${itemsOnly}                               | ${activityItems} | ${itemsOnlyFilledSubscaleScores}              | ${'should return filled scores: items only'}
      ${itemsAndSubscales}                       | ${{}}            | ${{}}                                         | ${'should return empty object'}
      ${{}}                                      | ${activityItems} | ${{}}                                         | ${'should return empty object'}
      ${{}}                                      | ${{}}            | ${{}}                                         | ${'should return empty object'}
      ${null}                                    | ${null}          | ${{}}                                         | ${'should return empty object'}
    `('$description', ({ subscales, activityItems, expected }) => {
      const settings = {
        ...mockedSubscaleSetting,
        subscales,
      };
      expect(
        getSubscales(settings, activityItems, {
          enableDataExportRenaming: true,
          enableSubscaleNullWhenSkipped: false,
        }),
      ).toEqual(expected);
    });
  });
});
