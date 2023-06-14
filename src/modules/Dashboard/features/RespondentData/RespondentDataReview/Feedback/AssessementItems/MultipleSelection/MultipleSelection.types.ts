import { MultiSelectActivityItem } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

export type MultipleSelectionProps = {
  activityItem: MultiSelectActivityItem;
  value: number[];
  isDisabled?: boolean;
  onChange?: (value: number[]) => void;
};
