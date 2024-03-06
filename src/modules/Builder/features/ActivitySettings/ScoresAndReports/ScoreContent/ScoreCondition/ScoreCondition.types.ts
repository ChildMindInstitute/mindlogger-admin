import { DataTableItem } from 'shared/components';
import { ScoreReport } from 'shared/state';

import { getScoreRange } from '../ScoreContent.utils';

export type ScoreConditionProps = {
  score: ScoreReport;
  name: string;
  reportsName: string;
  scoreConditionalsName: string;
  scoreKey: string;
  items: DataTableItem[];
  scoreRange: ReturnType<typeof getScoreRange>;
  'data-testid'?: string;
};
