import { SliderActivityItem } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

export type SliderProps = {
  activityItem: SliderActivityItem;
  value?: number;
  isDisabled?: boolean;
  onChange?: (value: number | number[]) => void;
  'data-testid'?: string;
};
