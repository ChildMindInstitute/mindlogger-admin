import { Controller, FieldValues } from 'react-hook-form';

import { Input } from './Input';
import { InputControllerProps } from './InputController.types';

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
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <Input
        onChange={onChange}
        value={value}
        error={!!error || providedError}
        helperText={isErrorVisible ? error?.message || helperText : ''}
        onCustomChange={onCustomChange}
        {...props}
      />
    )}
  />
);
