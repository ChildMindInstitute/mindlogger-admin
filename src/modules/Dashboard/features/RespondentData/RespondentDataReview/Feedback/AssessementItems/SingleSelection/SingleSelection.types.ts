import { RadioGroupProps } from '@mui/material';

import {
  DecryptedSingleSelectionAnswer,
  SingleSelectActivityItem,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

export type SingleSelectionProps = {
  value?: DecryptedSingleSelectionAnswer['value'];
  activityItem: SingleSelectActivityItem;
  isDisabled?: boolean;
  radioGroupProps?: RadioGroupProps;
  onChange?: (value: string) => void;
};
