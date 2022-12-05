import { ChangeEvent } from 'react';
import { FieldValues, UseControllerProps } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';

export type Option = {
  value: string;
  labelKey: string;
};

export type FormInputProps = {
  name: string;
  options: Option[];
  customChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
} & TextFieldProps;

export type SelectControllerProps<T extends FieldValues> = FormInputProps & UseControllerProps<T>;
