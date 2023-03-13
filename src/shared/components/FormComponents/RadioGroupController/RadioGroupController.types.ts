import { FormControlLabelProps, RadioGroupProps } from '@mui/material';
import { FieldValues, UseControllerProps } from 'react-hook-form';

type FormRadioGroupProps = {
  options: Omit<FormControlLabelProps, 'control'>[];
} & RadioGroupProps;

export type RadioGroupControllerProps<T extends FieldValues> = FormRadioGroupProps &
  UseControllerProps<T>;
