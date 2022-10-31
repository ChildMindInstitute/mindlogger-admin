import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

type FormCheckboxProps = {
  name: string;
  label: JSX.Element;
} & CheckboxProps;

export type InputControllerProps<T extends FieldValues> = FormCheckboxProps & UseControllerProps<T>;

export const CheckboxController = <T extends FieldValues>({
  name,
  label,
  control,
  ...checboxProps
}: InputControllerProps<T>) => (
  <FormControlLabel
    label={label}
    control={
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Checkbox {...checboxProps} checked={value} onChange={onChange} />
        )}
      />
    }
  />
);

export default CheckboxController;
