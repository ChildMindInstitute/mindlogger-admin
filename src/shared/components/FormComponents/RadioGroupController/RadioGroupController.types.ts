import { ChangeEvent } from 'react';
import { FormControlLabelProps, RadioGroupProps } from '@mui/material';
import { FieldValues, UseControllerProps } from 'react-hook-form';

type FormRadioGroupProps = {
  options: (Omit<FormControlLabelProps, 'control'> & {
    tooltipText?: string;
  })[];
  'data-testid'?: string;
} & RadioGroupProps;

export type RadioGroupControllerProps<T extends FieldValues> = Omit<
  FormRadioGroupProps,
  'onChange'
> &
  UseControllerProps<T> & {
    onChange?: (event: ChangeEvent<HTMLInputElement>, value: string, onChange: () => void) => void;
  };
