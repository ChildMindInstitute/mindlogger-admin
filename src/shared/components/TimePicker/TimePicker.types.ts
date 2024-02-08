import { SxProps } from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField';
import { FieldValues, UseControllerProps } from 'react-hook-form';

type TimePicker = {
  timeIntervals?: number;
  format?: string;
  label: string;
  width?: number;
  wrapperSx?: SxProps;
  minTime?: Date;
  maxTime?: Date;
  onCustomChange?: (time: string) => void;
  'data-testid'?: string;
} & TextFieldProps;

export type TimePickerProps<T extends FieldValues> = TimePicker & UseControllerProps<T>;
