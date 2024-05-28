import { ConditionItemType } from '../Condition.const';
import { ConditionItem, ConditionProps } from '../Condition.types';

export type SwitchConditionProps = {
  selectedItem?: ConditionItem;
  itemType?: ConditionItemType;
  dataTestid: ConditionProps['data-testid'];
} & Pick<ConditionProps, 'numberValueName' | 'minValueName' | 'maxValueName' | 'state'>;
