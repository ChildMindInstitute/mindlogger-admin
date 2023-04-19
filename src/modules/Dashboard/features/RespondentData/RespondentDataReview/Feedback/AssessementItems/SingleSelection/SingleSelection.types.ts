import { RadioGroupProps } from '@mui/material';

import { SingleSelectActivityItem } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

export type SingleSelectionProps = {
  value?: string;
  activityItem: SingleSelectActivityItem;
  isDisabled?: boolean;
  radioGroupProps?: RadioGroupProps;
  onChange?: (value: string) => void;
};
