import { TextFieldProps } from '@mui/material/TextField';
import { FieldValues, UseControllerProps } from 'react-hook-form';

export type FormInputProps = {
  name: string;
  options: string[] | undefined;
} & TextFieldProps;

export type TagsAutocompleteControllerProps<T extends FieldValues> = FormInputProps &
  UseControllerProps<T> & {
    onRemove?: (value: string) => void;
  };
