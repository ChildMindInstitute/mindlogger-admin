import { useRef } from 'react';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';

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
  const { clearErrors, trigger } = useFormContext();

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
      render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => {
        ref(inputRef.current);

        return (
          <Input
            inputRef={inputRef}
            type={type}
            onChange={
              onCustomChange
                ? onChange
                : (value) => {
                    // Clear errors immediately if field has error and user is entering data
                    if (error) {
                      clearErrors(name);
                    }
                    onChange(value);
                    // Trigger validation after change to check for new errors (e.g., empty field)
                    setTimeout(() => {
                      trigger(name);
                    }, 100);
                  }
            }
            onBlur={(event) => {
              onBlur();
              // Trigger validation on blur to check if field is empty
              setTimeout(() => {
                trigger(name);
              }, 100);
            }}
            value={value}
            error={!!error || providedError}
            helperText={isErrorVisible ? error?.message || helperText : ''}
            onCustomChange={onCustomChange}
            onWheel={handleOnWheel}
            {...props}
          />
        );
      }}
    />
  );
};
