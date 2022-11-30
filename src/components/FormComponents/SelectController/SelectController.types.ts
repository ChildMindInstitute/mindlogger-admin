import { TextFieldProps } from '@mui/material/TextField';
import { FieldValues, UseControllerProps } from 'react-hook-form';

export type Option = {
  value: string;
  labelKey: string;
};

export type FormInputProps = {
  name: string;
  options: Option[];
} & TextFieldProps;

export type SelectControllerProps<T extends FieldValues> = FormInputProps & UseControllerProps<T>;
