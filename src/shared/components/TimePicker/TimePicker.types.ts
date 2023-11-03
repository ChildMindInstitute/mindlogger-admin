import { FieldValues, UseControllerProps } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';
import { SxProps } from '@mui/material';

type TimePicker = {
  timeIntervals?: number;
  format?: string;
  label: string;
  width?: number;
  wrapperSx?: SxProps;
  minTime?: Date;
  maxTime?: Date;
  // providedValue?: string | null;
  'data-testid'?: string;
} & TextFieldProps;

export type TimePickerProps<T extends FieldValues> = TimePicker & UseControllerProps<T>;
