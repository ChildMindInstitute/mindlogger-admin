import { useRef } from 'react';
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
  type,
  ...props
}: InputControllerProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // removing the ability to change added number by scrolling - M2-6130
  const handleOnWheel = () => {
    if (inputRef.current && type === 'number') {
      inputRef.current.blur();
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <Input
          inputRef={inputRef}
          type={type}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          error={!!error || providedError}
          helperText={isErrorVisible ? error?.message || helperText : ''}
          onCustomChange={onCustomChange}
          onWheel={handleOnWheel}
          {...props}
        />
      )}
    />
  );
};
