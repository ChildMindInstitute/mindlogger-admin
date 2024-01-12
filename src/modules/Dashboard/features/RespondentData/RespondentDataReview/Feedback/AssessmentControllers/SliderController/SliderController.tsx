import { Controller, FieldValues } from 'react-hook-form';

import { Slider } from '../../AssessementItems';
import { SliderProps } from './SliderController.types';

export const SliderController = <T extends FieldValues>({
  name,
  control,
  activityItem: { activityItem },
  isDisabled = false,
  'data-testid': dataTestid,
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
        data-testid={dataTestid}
      />
    )}
  />
);
