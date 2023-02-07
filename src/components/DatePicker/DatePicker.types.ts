import { FieldValues, UseControllerProps } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';

export enum DateVariant {
  start = 'start',
  end = 'end',
}

export enum UiType {
  oneDate = 'oneDate',
  startEndingDate = 'startEndingDate',
}

type DatePicker = {
  uiType?: UiType;
} & TextFieldProps;

export type DatePickerProps<T extends FieldValues> = DatePicker & UseControllerProps<T>;
