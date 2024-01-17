import { AssessmentActivityItem } from 'modules/Dashboard/features/RespondentData/RespondentDataReview';

export type ItemPickerProps = {
  activityItem: AssessmentActivityItem;
  isDisabled: boolean;
  'data-testid'?: string;
};
