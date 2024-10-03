import { FormControlLabelProps, RadioGroupProps } from '@mui/material';
import { FieldValues, UseControllerProps } from 'react-hook-form';

type FormRadioGroupProps = {
  options: (Omit<FormControlLabelProps, 'control'> & {
    tooltipText?: string;
  })[];
  'data-testid'?: string;
} & RadioGroupProps;

export type RadioGroupControllerProps<T extends FieldValues> = FormRadioGroupProps &
  UseControllerProps<T>;
