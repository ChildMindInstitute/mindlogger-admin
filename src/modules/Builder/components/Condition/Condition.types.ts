import { Control } from 'react-hook-form';

import { ConditionType } from 'shared/consts';
import { SelectEvent } from 'shared/types';

import { ConditionItemType } from './Condition.const';

export type ConditionItem = {
  type: ConditionItemType;
  value: string;
  labelKey: string;
};

export type ConditionProps = {
  control: Control;
  itemName: string;
  stateName: string;
  optionValueName: string;
  numberValueName: string;
  minValueName: string;
  maxValueName: string;
  itemOptions: ConditionItem[];
  valueOptions: { value: string; labelKey: string }[];
  item: string;
  state: ConditionType;
  isRemoveVisible?: boolean;
  onItemChange: (e: SelectEvent) => void;
  onStateChange: (e: SelectEvent) => void;
  onRemove: () => void;
};
