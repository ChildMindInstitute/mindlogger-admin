import { FieldValues, UseControllerProps } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';
import { SxProps } from '@mui/material';

import { DatePickerInputProps } from './DatePickerInput/DatePickerInput.types';

export type DateType = Date | null;
export type DateArrayType = DateType[];

export const enum DateVariant {
  Start = 'start',
  End = 'end',
}

export const enum UiType {
  OneDate = 'oneDate',
  StartEndingDate = 'startEndingDate',
}

type DatePicker = {
  uiType?: UiType;
  inputSx?: SxProps;
  label?: string;
  minDate?: Date | null;
  maxDate?: Date | null;
  includeDates?: Date[];
  onMonthChange?: (date: Date) => void;
  disabled?: boolean;
  onCloseCallback?: (date?: DateType) => void;
  onSubmitCallback?: (date: DateType) => void;
  isLoading?: boolean;
  tooltip?: string;
  'data-testid'?: string;
} & TextFieldProps &
  Pick<DatePickerInputProps, 'placeholder' | 'hideLabel'>;

export type DatePickerProps<T extends FieldValues> = DatePicker & UseControllerProps<T>;

export type OnChangeRefType = {
  callback: (date: undefined | DateType) => void;
  prevValue: undefined | DateType;
};
