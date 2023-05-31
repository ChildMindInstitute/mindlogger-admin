import { ConditionItemType } from 'modules/Builder/components';

import { ScoreConditionRowType } from '../ConditionContent.types';

export type ConditionRowProps = {
  name: string;
  index: number;
  type: ScoreConditionRowType;
  onRemove: () => void;
};

export type OptionListItem = { labelKey: string; value: string; type: ConditionItemType };
