import { Controller, useFormContext } from 'react-hook-form';

import { Slider } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/AssessementItems';

import { SliderProps } from './SliderController.types';
import { getActivityItemIndex } from '../utils';

export const SliderController = ({ activityItem, isDisabled = false }: SliderProps) => {
  const { control, getValues } = useFormContext();

  const activityItemIndex = getActivityItemIndex(
    getValues('answers'),
    activityItem.activityItem.id || '',
  );

  return (
    <Controller
      name={`answers.${activityItemIndex}.answer.value`}
      control={control}
      render={({ field: { ref, onChange, ...sliderProps } }) => (
        <Slider
          {...sliderProps}
          {...activityItem}
          isDisabled={isDisabled}
          onChange={(value) => onChange(value)}
        />
      )}
    />
  );
};
