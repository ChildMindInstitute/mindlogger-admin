import { SwitchProps as BaseSwitchProps } from '@mui/material';
import { FieldValues, UseControllerProps } from 'react-hook-form';

export type SwitchProps = { label?: string } & BaseSwitchProps;

export type SwitchControllerProps<T extends FieldValues> = SwitchProps & UseControllerProps<T>;
