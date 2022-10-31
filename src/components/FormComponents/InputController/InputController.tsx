import TextField from '@mui/material/TextField';
import { Controller, FieldValues } from 'react-hook-form';

import { InputControllerProps } from './InputController.props';

export const InputController = <T extends FieldValues>({
  name,
  control,
  ...textFieldProps
}: InputControllerProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <TextField
        {...textFieldProps}
        onChange={onChange}
        value={value}
        error={!!error}
        helperText={error ? error.message : null}
      />
    )}
  />
);
