import { ConditionRowType } from 'modules/Builder/types';
import { Condition } from 'shared/state';

export type ConditionContentProps = {
  name: string;
  type: ConditionRowType;
  conditions: Condition[];
  onAddCondition: () => void;
  onRemoveCondition: (index: number) => void;
  scoreId?: string;
  'data-testid'?: string;
};
