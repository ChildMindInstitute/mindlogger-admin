import { Controller, FieldValues } from 'react-hook-form';

import { Slider } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/AssessementItems';

import { SliderProps } from './SliderController.types';

export const SliderController = <T extends FieldValues>({
  name,
  control,
  activityItem: { activityItem },
  isDisabled = false,
}: SliderProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { ref, onChange, ...sliderProps } }) => (
      <Slider
        {...sliderProps}
        activityItem={activityItem}
        isDisabled={isDisabled}
        onChange={(value) => onChange(value)}
      />
    )}
  />
);
