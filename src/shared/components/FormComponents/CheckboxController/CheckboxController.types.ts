import { ChangeEvent } from 'react';
import { CheckboxProps, SxProps } from '@mui/material';
import { FieldValues, UseControllerProps } from 'react-hook-form';

type FormCheckboxProps = {
  label: JSX.Element;
  isInversed?: boolean;
  onCustomChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  'data-testid'?: string;
  sxLabelProps?: SxProps;
} & CheckboxProps;

export type InputControllerProps<T extends FieldValues> = FormCheckboxProps & UseControllerProps<T>;
