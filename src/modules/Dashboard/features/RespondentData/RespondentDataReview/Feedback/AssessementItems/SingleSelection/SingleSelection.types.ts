import { RadioGroupProps } from '@mui/material';

import { SingleSelectActivityItem } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';
import { DecryptedSingleSelectionAnswer } from 'shared/types';

export type SingleSelectionProps = {
  value?: DecryptedSingleSelectionAnswer['value'];
  activityItem: SingleSelectActivityItem;
  isDisabled?: boolean;
  radioGroupProps?: RadioGroupProps;
  onChange?: (value: string) => void;
  'data-testid'?: string;
};
