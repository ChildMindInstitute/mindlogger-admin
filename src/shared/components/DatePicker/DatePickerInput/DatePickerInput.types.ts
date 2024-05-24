import { MouseEventHandler } from 'react';
import { FieldError } from 'react-hook-form';
import { TextFieldProps, SxProps } from '@mui/material';

export type DatePickerInputProps = {
  error?: FieldError;
  id?: string;
  inputSx?: SxProps;
  label?: string;
  disabled?: boolean;
  isOpen?: boolean;
  dataTestid?: string;
  handlePickerShow?: MouseEventHandler<HTMLDivElement>;
  placeholder?: string;
  hideLabel?: boolean;
} & Pick<TextFieldProps, 'value'>;
