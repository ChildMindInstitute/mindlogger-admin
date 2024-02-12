import { RadioGroup, Radio } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';
import uniqueId from 'lodash.uniqueid';

import { RadioGroupControllerProps } from './RadioGroupController.types';
import { StyledFormControlLabel } from './RadioGroupController.styles';

export const RadioGroupController = <T extends FieldValues>({
  name,
  control,
  options,
  defaultValue,
  'data-testid': dataTestid,
}: RadioGroupControllerProps<T>) => (
  <Controller
    control={control}
    name={name}
    defaultValue={defaultValue}
    render={({ field }) => (
      <RadioGroup {...field} data-testid={dataTestid}>
        {options?.map(({ value, label, disabled }, index) => (
          <StyledFormControlLabel
            key={uniqueId()}
            value={value}
            control={<Radio />}
            label={label}
            checked={value === field.value}
            disabled={disabled}
            data-testid={`${dataTestid}-${index}`}
          />
        ))}
      </RadioGroup>
    )}
  />
);
