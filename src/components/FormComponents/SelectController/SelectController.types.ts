import { FieldValues, UseControllerProps } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';

import { SelectEvent } from 'types/event';

export type Option = {
  value: string | boolean;
  labelKey: string;
};

export type FormInputProps = {
  options: Option[];
  value?: string;
  customChange?: (e: SelectEvent) => void;
} & TextFieldProps;

export type SelectControllerProps<T extends FieldValues> = FormInputProps & UseControllerProps<T>;
