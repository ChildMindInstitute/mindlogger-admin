import { CSSProperties } from 'react';
import { FieldValues, UseControllerProps } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';

import { SelectEvent } from 'shared/types/event';

export type Option = {
  value: string | boolean;
  labelKey: string;
  icon?: JSX.Element;
  disabled?: boolean;
  tooltip?: string;
};

export type FormInputProps = {
  options: Option[];
  value?: string;
  customChange?: (e: SelectEvent) => void;
  withChecked?: boolean;
  customLiStyles?: CSSProperties;
  isLabelTranslated?: boolean;
} & TextFieldProps;

export type SelectControllerProps<T extends FieldValues> = FormInputProps & UseControllerProps<T>;
