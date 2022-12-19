import TextField from '@mui/material/TextField';
import { Controller, FieldValues } from 'react-hook-form';

import { InputControllerProps } from './InputController.types';

export const InputController = <T extends FieldValues>({
  name,
  control,
  error: providedError,
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
        error={!!error || providedError}
        helperText={error ? error.message : null}
      />
    )}
  />
);
