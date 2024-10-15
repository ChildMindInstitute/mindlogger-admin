import { ChangeEvent } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';

import { StyledErrorText, variables } from 'shared/styles';

import { InputControllerProps } from './CheckboxController.types';

export const CheckboxController = <T extends FieldValues>({
  name,
  label,
  control,
  disabled,
  isInversed,
  onCustomChange,
  'data-testid': dataTestid,
  sxLabelProps = {},
  ...checkboxProps
}: InputControllerProps<T>) => {
  const handleCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>,
    onChange: (event: boolean) => void,
  ) => {
    const checked = event.target.checked;
    onChange(isInversed ? !checked : checked);
    onCustomChange && onCustomChange(event);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <FormControlLabel
            disabled={disabled}
            sx={{ opacity: disabled ? variables.opacity.disabled : 1, ...sxLabelProps }}
            label={label}
            control={
              <Checkbox
                {...checkboxProps}
                sx={{ color: error && variables.palette.semantic.error, ...checkboxProps.sx }}
                disabled={disabled}
                checked={(isInversed ? !value : value) ?? false}
                onChange={(event) => {
                  handleCheckboxChange(event, onChange);
                }}
              />
            }
            data-testid={dataTestid}
          />
          {error && <StyledErrorText marginTop={0}>{error?.message}</StyledErrorText>}
        </>
      )}
    />
  );
};
