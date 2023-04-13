import { Controller, FieldValues } from 'react-hook-form';
import { FormControlLabel, Switch as CustomSwitch } from '@mui/material';

import { SwitchControllerProps } from './Switch.types';

export const Switch = <T extends FieldValues>({
  control,
  name,
  label,
  ...props
}: SwitchControllerProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <FormControlLabel
        label={label}
        control={<CustomSwitch {...props} {...field} checked={field.value} />}
      />
    )}
  />
);
