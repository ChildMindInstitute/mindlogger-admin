import { OverridableStringUnion } from '@mui/types';
import { ButtonPropsColorOverrides } from '@mui/material';
import { BaseSyntheticEvent } from 'react';

type BtnSubmit =
  | ((e?: BaseSyntheticEvent | undefined) => Promise<void>)
  | ((value?: unknown) => void)
  | (() => void);

export type ActionsAlign = 'center' | 'space-around' | 'end';

export type ModalProps = {
  open: boolean;
  title: string;
  buttonText: string;
  children: JSX.Element | null;
  onClose: () => void;
  onSubmit: BtnSubmit;
  titleAlign?: 'left' | 'right' | 'center';
  actionsAlign?: ActionsAlign;
  disabledSubmit?: boolean;
  width?: string;
  hasSecondBtn?: boolean;
  secondBtnColor?: OverridableStringUnion<
    'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
    ButtonPropsColorOverrides
  >;
  secondBtnText?: string;
  onSecondBtnSubmit?: BtnSubmit;
  disabledSecondBtn?: boolean;
};
