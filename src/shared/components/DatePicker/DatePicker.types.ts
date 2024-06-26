import { FieldValues, UseControllerProps } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';

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
  minDate?: Date | null;
  maxDate?: Date | null;
  includeDates?: Date[];
  onMonthChange?: (date: Date) => void;
  onCloseCallback?: (date?: DateType) => void;
  onSubmitCallback?: (date: DateType) => void;
  isLoading?: boolean;
  tooltip?: string;
  'data-testid'?: string;
  skipMinDate?: boolean;
} & TextFieldProps &
  Pick<
    DatePickerInputProps,
    'label' | 'inputWrapperSx' | 'inputSx' | 'disabled' | 'placeholder' | 'hideLabel'
  >;

export type DatePickerProps<T extends FieldValues> = DatePicker & UseControllerProps<T>;

export type OnChangeRefType = {
  callback: (date: undefined | DateType) => void;
  prevValue: undefined | DateType;
};
