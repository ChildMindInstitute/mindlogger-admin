import { Checkbox, FormControlLabel } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';

import { InputControllerProps } from './CheckboxController.types';

export const CheckboxController = <T extends FieldValues>({
  name,
  label,
  control,
  disabled,
  ...checkboxProps
}: InputControllerProps<T>) => (
  <FormControlLabel
    disabled={disabled}
    sx={{ opacity: disabled ? 0.8 : 1 }}
    label={label}
    control={
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Checkbox {...checkboxProps} disabled={disabled} checked={value} onChange={onChange} />
        )}
      />
    }
  />
);
