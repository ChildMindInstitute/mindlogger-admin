import { TextFieldProps } from '@mui/material/TextField';
import { FieldValues, UseControllerProps } from 'react-hook-form';

type FormInputProps = {
  name: string;
  endTextAdornmentSingular?: string;
  endTextAdornmentPlural?: string;
  tooltip?: string;
} & TextFieldProps;

export type InputControllerProps<T extends FieldValues> = FormInputProps & UseControllerProps<T>;
