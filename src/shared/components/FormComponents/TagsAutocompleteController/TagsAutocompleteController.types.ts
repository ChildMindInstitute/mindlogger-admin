import { TextFieldProps } from '@mui/material/TextField';
import { FieldValues, UseControllerProps } from 'react-hook-form';

export type FormInputProps = {
  options: string[] | undefined;
  onRemove?: (value: string) => void;
} & TextFieldProps;

export type TagsAutocompleteControllerProps<T extends FieldValues> = FormInputProps &
  UseControllerProps<T>;
