import { DataTableItem } from 'shared/components';
import { ScoreReport } from 'shared/state';

export type ScoreConditionProps = {
  score: ScoreReport;
  name: string;
  reportsName: string;
  scoreKey: string;
  'data-testid'?: string;
  items: DataTableItem[];
};
