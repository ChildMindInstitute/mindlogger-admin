import { Controller, FieldValues } from 'react-hook-form';

import { InputControllerProps } from './InputController.types';
import { Input } from './Input';

export const InputController = <T extends FieldValues>({
  name,
  control,
  error: providedError,
  isErrorVisible = true,
  hideErrorUntilTouched = false,
  helperText,
  onChange: onCustomChange,
  ...props
}: InputControllerProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, value }, fieldState: { error, isTouched } }) => {
      const errorMsg = hideErrorUntilTouched || isTouched ? error?.message : null;

      return (
        <Input
          onChange={onChange}
          value={value}
          error={!!error || providedError}
          helperText={isErrorVisible ? errorMsg || helperText : ''}
          onCustomChange={onCustomChange}
          {...props}
        />
      );
    }}
  />
);
