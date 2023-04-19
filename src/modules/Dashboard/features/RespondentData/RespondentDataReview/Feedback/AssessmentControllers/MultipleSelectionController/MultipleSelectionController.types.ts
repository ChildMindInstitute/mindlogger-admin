import { FieldValues, UseControllerProps } from 'react-hook-form';

import { MultiSelectItemAnswer } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

export type MultipleSelectionProps<T extends FieldValues> = {
  activityItem: MultiSelectItemAnswer;
  isDisabled: boolean;
} & UseControllerProps<T>;
