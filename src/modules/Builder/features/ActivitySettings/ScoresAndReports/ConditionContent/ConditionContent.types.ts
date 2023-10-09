import { ConditionRowType } from 'modules/Builder/types';
import { ScoreReport } from 'shared/state';

export type ConditionContentProps = {
  name: string;
  type: ConditionRowType;
  score?: ScoreReport;
  'data-testid'?: string;
};
