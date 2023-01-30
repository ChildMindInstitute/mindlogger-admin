import { FieldValues, UseControllerProps } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';

import { SelectEvent } from 'types/event';

export type Option = {
  value: string | boolean;
  labelKey: string;
  icon?: JSX.Element;
};

export type FormInputProps = {
  options: Option[];
  value?: string;
  customChange?: (e: SelectEvent) => void;
  withChecked?: boolean;
} & TextFieldProps;

export type SelectControllerProps<T extends FieldValues> = FormInputProps & UseControllerProps<T>;
