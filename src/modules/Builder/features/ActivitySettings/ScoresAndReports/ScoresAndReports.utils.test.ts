import { ScoreOrSection, ScoreReport, SectionReport } from 'shared/state';
import { mockedMultiActivityItem, mockedSingleActivityItem } from 'shared/mock';
import { CalculationType, ScoreReportType } from 'shared/consts';

import {
  getReportIndex,
  getScoreDefaults,
  getSectionDefaults,
  getTableScoreItems,
} from './ScoresAndReports.utils';

jest.mock('uuid', () => ({
  ...jest.requireActual('uuid'),
  v4: () => 'mockedUudv4',
}));

const firstScore: ScoreReport = {
  type: ScoreReportType.Score,
  key: 'scoreKey',
  name: 'firstScore',
  id: 'sumScore_firstscore',
  calculationType: CalculationType.Sum,
  scoreType: 'rawScore',
  itemsScore: ['multiple', 'slider'],
  showMessage: true,
  printItems: false,
  message: 'message',
  itemsPrint: [],
  conditionalLogic: [],
};
const firstSection: SectionReport = {
  type: ScoreReportType.Section,
  name: 'firstSection',
  id: 'first_section',
  showMessage: true,
  printItems: false,
  message: 'section message',
  itemsPrint: [],
};
const secondScore: ScoreReport = {
  type: ScoreReportType.Score,
  name: 'secondScore',
  key: 'secondScoreKey',
  id: 'averageScore_secondscore',
  calculationType: CalculationType.Average,
  scoreType: 'rawScore',
  showMessage: true,
  printItems: false,
  itemsScore: ['single', 'multiple'],
  message: 'score message',
  itemsPrint: [],
  conditionalLogic: [],
};

const mockedReports = [firstScore, firstSection, secondScore];

describe('getScoreDefaults', () => {
  test('should return correct default score', () => {
    expect(getScoreDefaults()).toStrictEqual({
      name: '',
      type: 'score',
      key: 'mockedUudv4',
      id: 'sumScore_',
      calculationType: 'sum',
      itemsScore: [],
      scoreType: 'rawScore',
      linkedSubscaleName: '',
      showMessage: true,
      printItems: false,
      message: '',
      itemsPrint: [],
    });
  });
});

describe('getSectionDefaults', () => {
  test('should return correct default section', () => {
    expect(getSectionDefaults()).toStrictEqual({
      name: '',
      type: 'section',
      id: 'mockedUudv4',
      showMessage: true,
      printItems: false,
      message: '',
      itemsPrint: [],
    });
  });
});

describe('getReportIndex', () => {
  test.each`
    report          | expectedResult | description
    ${firstScore}   | ${0}           | ${'should be 0'}
    ${firstSection} | ${0}           | ${'should be 1'}
    ${secondScore}  | ${1}           | ${'should be 0'}
  `('$description', async ({ report, expectedResult }) => {
    expect(getReportIndex(mockedReports as ScoreOrSection[], report)).toBe(expectedResult);
  });
});

describe('getTableScoreItems', () => {
  test('should return correct table score items', () => {
    expect(getTableScoreItems([mockedSingleActivityItem, mockedMultiActivityItem])).toStrictEqual([
      {
        id: 'ea07cf9f-4fd3-42e7-b4a1-f88fb00ef629',
        label: 'single_text_score: single [[text_last]]',
        name: 'single_text_score',
        tooltip: 'single [[text_last]]',
      },
      {
        id: '63b765ff-73aa-453f-8d0d-fc7bca72fd1f',
        label: 'multi_text_score: multi [[single_text_score]]',
        name: 'multi_text_score',
        tooltip: 'multi [[single_text_score]]',
      },
    ]);
  });
});
