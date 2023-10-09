import { ItemFormValues } from 'modules/Builder/types';
import { DataTableItem } from 'shared/components';

export type ScoreContentProps = {
  name: string;
  title: string;
  index: number;
  'data-testid'?: string;
  items: DataTableItem[];
  tableItems: DataTableItem[];
  scoreItems: ItemFormValues[];
};

export type GetScoreRangeLabel = {
  minScore: number;
  maxScore: number;
};
