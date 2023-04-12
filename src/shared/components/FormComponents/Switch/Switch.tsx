import { Controller, FieldValues } from 'react-hook-form';
import { FormControlLabel } from '@mui/material';

import { StyledSwitch } from './Switch.styles';
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
    render={({ field: { onChange, value } }) => (
      <FormControlLabel
        label={label}
        control={<StyledSwitch {...props} value={value} onChange={(event, val) => onChange(val)} />}
      />
    )}
  />
);
