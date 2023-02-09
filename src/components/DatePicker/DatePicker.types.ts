import { FieldValues, UseControllerProps } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';

export enum DateVariant {
  Start = 'start',
  End = 'end',
}

export enum UiType {
  OneDate = 'oneDate',
  StartEndingDate = 'startEndingDate',
}

type DatePicker = {
  uiType?: UiType;
} & TextFieldProps;

export type DatePickerProps<T extends FieldValues> = DatePicker & UseControllerProps<T>;
