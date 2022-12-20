import { TextFieldProps } from '@mui/material/TextField';
import { FieldValues, UseControllerProps } from 'react-hook-form';

export type FormInputProps = {
  name: string;
  tags: string[];
  onAddTagClick: (value: string) => void;
  onRemoveTagClick: (index: number) => void;
} & TextFieldProps;

export type TagsInputControllerProps<T extends FieldValues> = FormInputProps &
  UseControllerProps<T>;
