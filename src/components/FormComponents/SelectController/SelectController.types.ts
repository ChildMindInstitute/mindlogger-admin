import { ChangeEvent } from 'react';
import { TextFieldProps } from '@mui/material/TextField';

import { FieldValues, UseControllerProps } from 'react-hook-form';

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
