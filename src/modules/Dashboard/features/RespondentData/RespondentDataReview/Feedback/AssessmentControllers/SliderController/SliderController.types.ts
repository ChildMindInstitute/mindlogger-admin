import { FieldValues, UseControllerProps } from 'react-hook-form';

import { SliderItemAnswer } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

export type SliderProps<T extends FieldValues> = {
  activityItem: SliderItemAnswer;
  isDisabled?: boolean;
  'data-testid'?: string;
} & UseControllerProps<T>;
