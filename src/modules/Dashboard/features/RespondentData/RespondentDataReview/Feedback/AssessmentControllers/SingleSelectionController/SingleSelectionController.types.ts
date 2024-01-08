import { FieldValues, UseControllerProps } from 'react-hook-form';

import { SingleSelectItemAnswer } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

export type SingleSelectionProps<T extends FieldValues> = {
  activityItem: SingleSelectItemAnswer;
  isDisabled: boolean;
  'data-testid'?: string;
} & UseControllerProps<T>;
