import { TextFieldProps } from '@mui/material/TextField';
import { FieldValues, UseControllerProps } from 'react-hook-form';

export type FormInputProps = {
  options: string[] | undefined;
  labelAllSelect?: string;
  noOptionsText?: string;
} & TextFieldProps;

export type TagsAutocompleteControllerProps<T extends FieldValues> = FormInputProps &
  UseControllerProps<T>;
