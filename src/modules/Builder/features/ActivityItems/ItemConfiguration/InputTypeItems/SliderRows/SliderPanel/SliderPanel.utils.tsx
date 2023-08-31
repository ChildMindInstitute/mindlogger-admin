import i18n from 'i18n';
import { HeadCell } from 'shared/types/table';
import { createArray } from 'shared/utils';

import { ScoreCell } from './ScoreCell';

const { t } = i18n;

export const getHeadCells = (min: number, max: number): HeadCell[] =>
  createArray(max - min + 1, (index: number) => ({
    id: `${min + index}`,
    label: `${min + index}`,
  }));

export const getTableRows = (scores: number[] = [], name: string) => [
  scores.reduce(
    (result, score, index) => ({
      ...result,
      [`${name}.scores[${index}]`]: {
        content: () => (
          <ScoreCell
            name={`${name}.scores[${index}]`}
            data-testid={`builder-activity-items-item-configuration-slider-scores-table-score-${index}`}
          />
        ),
        value: `${score}`,
      },
    }),
    {},
  ),
];

export const getStaticHeadRow = () => [{ id: 'placeholder', label: t('value') }];

export const getStaticBodyRow = () => [
  { placeholder: { content: () => t('score'), value: t('score') } },
];

export const getMarks = (min: number, max: number, hasLabels: boolean) =>
  createArray(max - min + 1, (index: number) => ({
    value: min + index,
    ...(hasLabels && { label: `${min + index}` }),
  }));
