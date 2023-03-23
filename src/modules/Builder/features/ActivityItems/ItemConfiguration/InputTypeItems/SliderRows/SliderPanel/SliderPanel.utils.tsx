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

export const getTableRows = (scores: number[], name: string) => [
  scores.reduce(
    (result, score, index) => ({
      ...result,
      [`${name}.scores[${index}]`]: {
        content: () => <ScoreCell name={`${name}.scores[${index}]`} />,
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

export const getMarksByScores = (scores: number[]) =>
  scores?.every((score: number) => typeof score === 'number')
    ? scores?.map((score: number) => ({ value: score }))
    : [];
