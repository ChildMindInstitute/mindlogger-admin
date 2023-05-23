import { ConditionItemType } from 'modules/Builder/components';

export type ConditionRowProps = {
  name: string;
  index: number;
  onRemove: () => void;
};

export type OptionListItem = { labelKey: string; value: string; type: ConditionItemType };
