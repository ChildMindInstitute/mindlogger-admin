import { FieldValues, UseControllerProps } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';

type TimePicker = {
  name: string;
  timeIntervals?: number;
} & TextFieldProps;

export type TimePickerProps<T extends FieldValues> = TimePicker & UseControllerProps<T>;
