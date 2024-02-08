// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ScoreOrSection } from 'redux/modules';
import { CalculationType } from 'shared/consts';
import {
  mockedMultiActivityItem,
  mockedScoreReport,
  mockedSingleActivityItem,
  mockedSliderActivityItem,
} from 'shared/mock';

import {
  getIsScoreIdVariable,
  getScoreId,
  getScoreRange,
  getScoreRangeLabel,
  updateMessagesWithVariable,
} from './ScoreContent.utils';

const report = { ...mockedScoreReport, showMessage: true };
const mockedSkippableSingleItem = {
  ...mockedSingleActivityItem,
  config: {
    ...mockedSingleActivityItem.config,
    skippableItem: true,
  },
};

describe('getScoreId', () => {
  test.each`
    name               | calculationType               | expectedResult                  | description
    ${'catScore@'}     | ${CalculationType.Average}    | ${'averageScore_catscore_'}     | ${'should be averageScore_catscore_ for catScore@ name'}
    ${'DOG!SCORE'}     | ${CalculationType.Sum}        | ${'sumScore_dog_score'}         | ${'should be sumScore_dog_score for DOG!SCORE name'}
    ${'rAbbit~score$'} | ${CalculationType.Percentage} | ${'percentScore_rabbit_score_'} | ${'should be percentScore_rabbit_score_ for rAbbit~score$'}
  `('$description', async ({ name, calculationType, expectedResult }) => {
    expect(getScoreId(name, calculationType)).toBe(expectedResult);
  });
});

describe('getScoreRangeLabel', () => {
  test.each`
    minScore  | maxScore  | expectedResult     | description
    ${10.234} | ${25.2}   | ${'10.23 ~ 25.20'} | ${'should be "10.23 ~ 25.20"'}
    ${1.0}    | ${2.7999} | ${'1.00 ~ 2.80'}   | ${'should be "1.00 ~ 2.80"'}
    ${3}      | ${3.001}  | ${'3.00 ~ 3.00'}   | ${'should be "3.00 ~ 3.00"'}
  `('$description', async ({ minScore, maxScore, expectedResult }) => {
    expect(getScoreRangeLabel({ minScore, maxScore })).toBe(expectedResult);
  });
});

describe('getScoreRange', () => {
  test.each`
    items                                                   | calculationType               | isActivitySkippable | expectedResult                     | description
    ${[mockedSliderActivityItem]}                           | ${CalculationType.Average}    | ${false}            | ${{ maxScore: 6, minScore: 1 }}    | ${'should be from 1 to 6'}
    ${[mockedSingleActivityItem]}                           | ${CalculationType.Sum}        | ${false}            | ${{ maxScore: 4, minScore: 2 }}    | ${'should be from 2 to 4'}
    ${[mockedMultiActivityItem]}                            | ${CalculationType.Average}    | ${false}            | ${{ maxScore: 3, minScore: 1 }}    | ${'should be from 1 to 3'}
    ${[mockedSliderActivityItem, mockedSingleActivityItem]} | ${CalculationType.Percentage} | ${false}            | ${{ maxScore: 100, minScore: 30 }} | ${'should be from 30 to 100'}
    ${[mockedSkippableSingleItem]}                          | ${CalculationType.Sum}        | ${false}            | ${{ maxScore: 4, minScore: 0 }}    | ${'should be from 0 to 4 if item is skippable'}
    ${[mockedSliderActivityItem, mockedSingleActivityItem]} | ${CalculationType.Sum}        | ${true}             | ${{ maxScore: 10, minScore: 0 }}   | ${'should be from 0 to 10 if activity is skippable'}
    ${undefined}                                            | ${CalculationType.Sum}        | ${true}             | ${{ maxScore: 0, minScore: 0 }}    | ${'should be from 0 to 0 if items is undefined'}
  `('$description', async ({ items, calculationType, expectedResult, isActivitySkippable }) => {
    expect(
      getScoreRange({
        items,
        calculationType,
        activity: { isSkippable: isActivitySkippable },
      }),
    ).toStrictEqual(expectedResult);
  });
});

describe('getIsScoreIdVariable', () => {
  const reportWithoutVariable = { ...report, message: 'regular message' };

  test.each`
    score                    | expectedResult | description
    ${report}                | ${true}        | ${'should be true'}
    ${reportWithoutVariable} | ${false}       | ${'should be false'}
  `('$description', async ({ score, expectedResult }) => {
    expect(getIsScoreIdVariable({ id: score.id, reports: [score], isScore: true })).toBe(expectedResult);
  });
});

describe('updateMessagesWithVariable', () => {
  const mockedSetValue = jest.fn();

  test.each`
    name            | newScoreId       | description
    ${'scoreFirst'} | ${'scoreSecond'} | ${'should set new message with scoreSecond variable'}
    ${'score_F'}    | ${'score'}       | ${'should set new message with score variable'}
  `('$description', async ({ name, newScoreId }) => {
    updateMessagesWithVariable({
      setValue: mockedSetValue,
      reportsName: name,
      reports: [report as ScoreOrSection],
      oldScoreId: report.id,
      newScoreId,
    });

    expect(mockedSetValue).nthCalledWith(1, `${name}.0.message`, `message [[${newScoreId}]]`);
    expect(mockedSetValue).nthCalledWith(2, `${name}.0.conditionalLogic.0.message`, 'message');
  });
});
