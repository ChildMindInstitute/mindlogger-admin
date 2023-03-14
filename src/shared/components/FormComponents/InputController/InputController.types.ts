import { TextFieldProps } from '@mui/material/TextField';
import { FieldValues, UseControllerProps } from 'react-hook-form';

type FormInputProps = {
  textAdornment?: string;
  tooltip?: string;
  maxLength?: number;
  maxNumberValue?: number;
  defaultNumberValue?: number;
} & TextFieldProps;

export type InputControllerProps<T extends FieldValues> = FormInputProps & UseControllerProps<T>;
