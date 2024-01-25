import { ConditionRowType } from 'modules/Builder/types';
import { ScoreReport } from 'shared/state';

import { getScoreRange } from '../ScoreContent/ScoreContent.utils';

export type ConditionContentProps = {
  name: string;
  type: ConditionRowType;
  score?: ScoreReport;
  scoreRange?: ReturnType<typeof getScoreRange>;
  'data-testid'?: string;
};
