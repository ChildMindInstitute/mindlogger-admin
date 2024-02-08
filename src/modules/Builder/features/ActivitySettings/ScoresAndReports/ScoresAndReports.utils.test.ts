import { ScoreOrSection } from 'shared/state';
import { mockedMultiActivityItem, mockedSingleActivityItem } from 'shared/mock';

import { getReportIndex, getScoreDefaults, getSectionDefaults, getTableScoreItems } from './ScoresAndReports.utils';

jest.mock('uuid', () => ({
  ...jest.requireActual('uuid'),
  v4: () => 'mockedUudv4',
}));

const firstScore = {
  type: 'score',
  key: 'scoreKey',
  name: 'firstScore',
  id: 'sumScore_firstscore',
  calculationType: 'sum',
  itemsScore: ['multiple', 'slider'],
  showMessage: true,
  printItems: false,
  message: 'message',
  itemsPrint: [],
  conditionalLogic: [],
};
const firstSection = {
  type: 'section',
  name: 'firstSection',
  key: 'sectionKey',
  showMessage: true,
  printItems: false,
  message: 'section message',
  itemsPrint: [],
  conditionalLogic: null,
};
const secondScore = {
  type: 'score',
  name: 'secondScore',
  key: 'secondScoreKey',
  id: 'averageScore_secondscore',
  calculationType: 'average',
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
