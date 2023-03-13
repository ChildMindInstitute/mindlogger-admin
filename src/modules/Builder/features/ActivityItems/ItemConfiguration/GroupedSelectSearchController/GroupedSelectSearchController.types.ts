import { FieldValues, UseControllerProps } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';

import { ItemsOptionGroup } from '../ItemConfiguration.types';

export type FormInputProps = {
  options: ItemsOptionGroup[];
} & TextFieldProps;

export type GroupedSelectControllerProps<T extends FieldValues> = FormInputProps &
  UseControllerProps<T>;
