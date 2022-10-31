import TextField, { TextFieldProps } from '@mui/material/TextField';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

type FormInputProps = {
  name: string;
} & TextFieldProps;

export type InputControllerProps<T extends FieldValues> = FormInputProps & UseControllerProps<T>;

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
