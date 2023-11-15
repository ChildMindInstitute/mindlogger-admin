import { ChangeEvent } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';

import { variables } from 'shared/styles';

import { InputControllerProps } from './CheckboxController.types';

export const CheckboxController = <T extends FieldValues>({
  name,
  label,
  control,
  disabled,
  isInversed,
  onCustomChange,
  'data-testid': dataTestid,
  ...checkboxProps
}: InputControllerProps<T>) => {
  const handleCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>,
    onChange: (event: boolean) => void,
  ) => {
    const checked = event.target.checked;
    onCustomChange && onCustomChange(event);
    onChange(isInversed ? !checked : checked);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <FormControlLabel
          disabled={disabled}
          sx={{ opacity: disabled ? variables.opacity.disabled : 1 }}
          label={label}
          control={
            <Checkbox
              {...checkboxProps}
              disabled={disabled}
              checked={(isInversed ? !value : value) ?? false}
              onChange={(event) => {
                handleCheckboxChange(event, onChange);
              }}
            />
          }
          data-testid={dataTestid}
        />
      )}
    />
  );
};
