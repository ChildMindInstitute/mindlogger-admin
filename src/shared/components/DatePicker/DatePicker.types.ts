import { SxProps } from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField';
import { FieldValues, UseControllerProps } from 'react-hook-form';

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
} & TextFieldProps;

export type DatePickerProps<T extends FieldValues> = DatePicker & UseControllerProps<T>;
