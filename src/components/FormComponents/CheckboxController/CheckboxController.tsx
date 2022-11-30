import { Checkbox, FormControlLabel } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';

import { InputControllerProps } from './CheckboxController.types';

export const CheckboxController = <T extends FieldValues>({
  name,
  label,
  control,
  ...checkboxProps
}: InputControllerProps<T>) => (
  <FormControlLabel
    label={label}
    control={
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Checkbox {...checkboxProps} checked={value} onChange={onChange} />
        )}
      />
    }
  />
);
