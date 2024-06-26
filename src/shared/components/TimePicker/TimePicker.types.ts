import { ChangeEvent } from 'react';
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
  onCustomChange?: (time: string) => void;
  'data-testid'?: string;
  defaultTime?: string;
  placeholder?: string;
  inputSx?: SxProps;
} & TextFieldProps;

export type TimePickerProps<T extends FieldValues> = TimePicker & UseControllerProps<T>;

export type InputOnChange = (value: string) => void;

export type HandleChange = {
  date: Date | null;
  event: ChangeEvent<HTMLInputElement>;
  onChange: InputOnChange;
};
