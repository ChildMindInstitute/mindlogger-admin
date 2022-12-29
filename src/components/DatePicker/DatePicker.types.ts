import { FieldValues, UseControllerProps } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';

export enum DateVariant {
  start = 'start',
  end = 'end',
}

export enum MinMaxDate {
  min = 'min',
  max = 'max',
}

export enum UiType {
  oneDate = 'oneDate',
  startEndingDate = 'startEndingDate',
}

type DatePicker = {
  name: string;
  uiType?: UiType;
} & TextFieldProps;

export type DatePickerProps<T extends FieldValues> = DatePicker & UseControllerProps<T>;
