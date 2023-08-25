import { v4 as uuidv4 } from 'uuid';

import { CalculationType, ScoreReportType } from 'shared/consts';
import { ScoreOrSection } from 'shared/state';

import { getScoreId } from './ScoreContent/ScoreContent.utils';

export const getScoreDefaults = () => ({
  name: '',
  type: ScoreReportType.Score,
  id: getScoreId('', CalculationType.Sum),
  calculationType: CalculationType.Sum,
  itemsScore: [],
  showMessage: true,
  printItems: false,
  message: '',
  itemsPrint: [],
});

export const getSectionDefaults = () => ({
  name: '',
  type: ScoreReportType.Section,
  id: uuidv4(),
  showMessage: true,
  printItems: false,
  message: '',
  itemsPrint: [],
});

export const getReportIndex = (reports: ScoreOrSection[], report: ScoreOrSection) =>
  reports?.reduce(
    ({ index, done }, { type, id }) => {
      if (done || report.type !== type) return { index, done };
      if (report.id === id) return { index, done: true };

      return { index: index + 1, done };
    },
    { index: 0, done: false },
  ).index;
