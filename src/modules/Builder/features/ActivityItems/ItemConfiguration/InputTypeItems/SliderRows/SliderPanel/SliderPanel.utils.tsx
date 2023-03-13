import { HeadCell } from 'shared/types/table';

import { ScoreCell } from './ScoreCell';

export const getHeadCells = (min: number, max: number): HeadCell[] =>
  Array.from({ length: max - min + 1 }).map((item, index) => ({
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
