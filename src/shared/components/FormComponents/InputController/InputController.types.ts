import { FC, ReactNode, PropsWithChildren } from 'react';
import { TextFieldProps } from '@mui/material/TextField';
import { FieldValues, UseControllerProps } from 'react-hook-form';

type CounterProps = {
  value: number;
  maxLength?: number;
  counterProps?: Record<string, unknown>;
};

type FormInputProps = {
  textAdornment?: string;
  tooltip?: string;
  maxLength?: number;
  minNumberValue?: number;
  maxNumberValue?: number;
  isEmptyStringAllowed?: boolean;
  isErrorVisible?: boolean;
  restrictExceededValueLength?: boolean;
  onAddNumber?: (value: number) => void;
  onDistractNumber?: (value: number) => void;
  Counter?: FC<PropsWithChildren<CounterProps>>;
  counterProps?: Record<string, unknown>;
} & TextFieldProps;

export type InputControllerProps<T extends FieldValues> = FormInputProps & UseControllerProps<T>;
