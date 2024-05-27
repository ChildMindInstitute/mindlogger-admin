import { ConditionType } from 'shared/consts';
import { SelectEvent } from 'shared/types';
import { ConditionRowType } from 'modules/Builder/types';
import { SingleAndMultipleSelectItemResponseValues, SliderItemResponseValues } from 'shared/state';

import { ConditionItemType } from './Condition.const';

export type ConditionItem = {
  type: ConditionItemType;
  value: string;
  labelKey: string;
  responseValues?: SingleAndMultipleSelectItemResponseValues | SliderItemResponseValues;
};

export type ConditionProps = {
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
  type: ConditionRowType;
  'data-testid'?: string;
};

export type SwitchConditionProps = {
  selectedItem?: ConditionItem;
  itemType?: ConditionItemType;
  dataTestid: ConditionProps['data-testid'];
} & Pick<ConditionProps, 'numberValueName' | 'minValueName' | 'maxValueName' | 'state'>;
