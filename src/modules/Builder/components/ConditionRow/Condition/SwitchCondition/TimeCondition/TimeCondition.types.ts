import { SwitchConditionProps } from '../SwitchCondition.types';

export type TimeConditionProps = Pick<SwitchConditionProps, 'dataTestid'> & {
  numberValueName: string;
  minValueName: string;
  maxValueName: string;
  maxValue: null | string;
  isSingleValueShown: boolean;
  isRangeValueShown: boolean;
};
