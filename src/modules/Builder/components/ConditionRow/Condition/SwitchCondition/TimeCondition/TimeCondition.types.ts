import { ConditionType } from 'shared/consts';

import { SwitchConditionProps } from '../SwitchCondition.types';

export type TimeConditionProps = Pick<SwitchConditionProps, 'dataTestid'> & {
  timeValueName: string;
  minTimeValueName: string;
  maxTimeValueName: string;
  maxTimeValue: string;
  isSingleValueShown: boolean;
  isRangeValueShown: boolean;
  state?: ConditionType;
};
