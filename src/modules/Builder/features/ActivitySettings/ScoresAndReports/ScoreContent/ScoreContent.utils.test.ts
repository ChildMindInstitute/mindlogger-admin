import { CalculationType } from 'shared/consts';
import {
  mockedMultiActivityItem,
  mockedScoreReport,
  mockedSingleActivityItem,
  mockedSliderActivityItem,
} from 'shared/mock';
import { ScoreOrSection } from 'redux/modules';

import {
  getIsScoreIdVariable,
  getScoreId,
  getScoreRange,
  getScoreRangeLabel,
  updateMessagesWithVariable,
} from './ScoreContent.utils';

const report = { ...mockedScoreReport, showMessage: true };

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
    items                                                   | calculationType               | expectedResult                     | description
    ${[mockedSliderActivityItem]}                           | ${CalculationType.Average}    | ${{ maxScore: 6, minScore: 1 }}    | ${'should be from 1 to 6'}
    ${[mockedSingleActivityItem]}                           | ${CalculationType.Sum}        | ${{ maxScore: 4, minScore: 2 }}    | ${'should be from 2 to 4'}
    ${[mockedMultiActivityItem]}                            | ${CalculationType.Average}    | ${{ maxScore: 3, minScore: 1 }}    | ${'should be from 1 to 3'}
    ${[mockedSliderActivityItem, mockedSingleActivityItem]} | ${CalculationType.Percentage} | ${{ maxScore: 100, minScore: 30 }} | ${'should be from 30 to 100'}
  `('$description', async ({ items, calculationType, expectedResult }) => {
    expect(getScoreRange({ items, calculationType })).toStrictEqual(expectedResult);
  });
});

describe('getIsScoreIdVariable', () => {
  const reportWithoutVariable = { ...report, message: 'regular message' };

  test.each`
    score                    | expectedResult | description
    ${report}                | ${true}        | ${'should be true'}
    ${reportWithoutVariable} | ${false}       | ${'should be false'}
  `('$description', async ({ score, expectedResult }) => {
    expect(getIsScoreIdVariable(score, [score])).toBe(expectedResult);
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
