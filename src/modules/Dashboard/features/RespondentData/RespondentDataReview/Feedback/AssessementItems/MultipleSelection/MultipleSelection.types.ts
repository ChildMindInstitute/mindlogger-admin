import { MultiSelectActivityItem } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

export type MultipleSelectionProps = {
  activityItem: MultiSelectActivityItem;
  value: string[];
  isDisabled?: boolean;
  onChange?: (value: string[]) => void;
};
