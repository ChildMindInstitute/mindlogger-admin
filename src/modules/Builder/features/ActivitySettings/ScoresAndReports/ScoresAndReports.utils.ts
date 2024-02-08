import { v4 as uuidv4 } from 'uuid';

import { ItemFormValues } from 'modules/Builder/types';
import { removeMarkdown } from 'modules/Builder/utils';
import { DataTableItem } from 'shared/components';
import { CalculationType, ScoreReportType } from 'shared/consts';
import { ScoreOrSection } from 'shared/state';
import { getEntityKey } from 'shared/utils';

import { getScoreId } from './ScoreContent/ScoreContent.utils';

export const getScoreDefaults = () => ({
  name: '',
  type: ScoreReportType.Score,
  key: uuidv4(),
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
    ({ index, done }, item) => {
      if (done || report.type !== item.type) return { index, done };
      if (getEntityKey(report, false) === getEntityKey(item, false)) return { index, done: true };

      return { index: index + 1, done };
    },
    { index: 0, done: false },
  ).index;

export const getTableScoreItems = (items?: ItemFormValues[]) =>
  items?.reduce((tableScoreItems: DataTableItem[], item) => {
    if (item.isHidden) return tableScoreItems;

    return [
      ...tableScoreItems,
      {
        id: getEntityKey(item),
        name: item.name,
        tooltip: removeMarkdown(item.question),
        label: `${item.name}: ${removeMarkdown(item.question)}`,
      },
    ];
  }, []);
