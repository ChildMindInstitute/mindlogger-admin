import { Controller, FieldValues } from 'react-hook-form';

import { InputControllerProps } from './InputController.types';
import { Input } from './Input';

export const InputController = <T extends FieldValues>({
  name,
  control,
  error: providedError,
  isErrorVisible = true,
  helperText,
  onChange: onCustomChange,
  ...props
}: InputControllerProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
      <Input
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        error={!!error || providedError}
        helperText={isErrorVisible ? error?.message || helperText : ''}
        onCustomChange={onCustomChange}
        {...props}
      />
    )}
  />
);
