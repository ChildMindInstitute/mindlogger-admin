import { ChangeEvent } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';

import { InputControllerProps } from './CheckboxController.types';

export const CheckboxController = <T extends FieldValues>({
  name,
  label,
  control,
  disabled,
  isInversed,
  ...checkboxProps
}: InputControllerProps<T>) => {
  const handleCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>,
    onChange: (event: boolean) => void,
  ) => {
    const checked = event.target.checked;
    onChange(isInversed ? !checked : checked);
  };

  return (
    <FormControlLabel
      disabled={disabled}
      sx={{ opacity: disabled ? 0.8 : 1 }}
      label={label}
      control={
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Checkbox
              {...checkboxProps}
              disabled={disabled}
              checked={isInversed ? !value : value}
              onChange={(event) => {
                handleCheckboxChange(event, onChange);
              }}
            />
          )}
        />
      }
    />
  );
};
