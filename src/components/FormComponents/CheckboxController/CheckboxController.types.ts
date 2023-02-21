import { CheckboxProps } from '@mui/material';
import { FieldValues, UseControllerProps } from 'react-hook-form';

type FormCheckboxProps = {
  label: JSX.Element;
} & CheckboxProps;

export type InputControllerProps<T extends FieldValues> = FormCheckboxProps & UseControllerProps<T>;
