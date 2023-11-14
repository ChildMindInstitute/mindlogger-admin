import { FC, PropsWithChildren } from 'react';
import { TextFieldProps } from '@mui/material/TextField';
import { FieldValues, UseControllerProps } from 'react-hook-form';

type CounterProps = {
  value: number;
  maxLength?: number;
  counterProps?: Record<string, unknown>;
  hasError?: boolean;
};

export type FormInputProps = {
  textAdornment?: string;
  tooltip?: string;
  maxLength?: number;
  minNumberValue?: number;
  maxNumberValue?: number;
  isErrorVisible?: boolean;
  restrictExceededValueLength?: boolean;
  onArrowPress?: (value: number) => void;
  Counter?: FC<PropsWithChildren<CounterProps>>;
  counterProps?: Record<string, unknown>;
  hintText?: string;
  'data-testid'?: string;
} & TextFieldProps;

export type InputControllerProps<T extends FieldValues> = FormInputProps & UseControllerProps<T>;
