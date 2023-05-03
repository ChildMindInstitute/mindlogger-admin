import { RadioGroup, Radio } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';
import uniqueId from 'lodash.uniqueid';

import { RadioGroupControllerProps } from './RadioGroupController.types';
import { StyledFormControlLabel } from './RadioGroupController.styles';

export const RadioGroupController = <T extends FieldValues>({
  name,
  control,
  options,
}: RadioGroupControllerProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <RadioGroup {...field}>
        {options?.map(({ value, label }) => (
          <StyledFormControlLabel
            key={uniqueId()}
            value={value}
            control={<Radio />}
            label={label}
            checked={value === field.value}
          />
        ))}
      </RadioGroup>
    )}
  />
);
