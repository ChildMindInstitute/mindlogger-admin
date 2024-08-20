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
  defaultControllerValue,
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

  // Since this is a *checkbox* controller, we only really care about the
  // `boolean` type. And indeed the type of `defaultControllerValue` is
  // `boolean | undefined`. However, the way we render the generic `Controller`
  // component below means it can't properly infer the type of its field's
  // value, which means the type of the controller's own `defaultValue` prop
  // would end up being something along the line of `string | undefined`, which
  // is just the standard HTML element attribute value type.
  // So that's why we have to include `string` and `undefined` in the Record's
  // value type, so this entire object would be compatible with the props of a
  // generically rendered `Controller` component.
  const defaultValueProps: Record<string, boolean | string | undefined> = {
    defaultValue: defaultControllerValue,
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
                sx={{ color: error && variables.palette.semantic.error }}
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
      {...defaultValueProps}
    />
  );
};
