import { OverridableStringUnion } from '@mui/types';
import { ButtonPropsColorOverrides, SxProps } from '@mui/material';
import { BaseSyntheticEvent } from 'react';

type BtnSubmit =
  | ((e?: BaseSyntheticEvent | undefined) => Promise<void>)
  | ((value?: unknown) => void)
  | (() => void);

export type ActionsAlign = 'center' | 'space-around' | 'end' | 'space-between';

export type SubmitBtnColor = OverridableStringUnion<
  'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
  ButtonPropsColorOverrides
>;

export enum SubmitBtnVariant {
  Text = 'text',
  Contained = 'contained',
}

export type ModalProps = {
  open: boolean;
  title: string;
  buttonText: string;
  children: JSX.Element | null;
  onClose: () => void;
  onSubmit?: BtnSubmit;
  titleAlign?: 'left' | 'right' | 'center';
  disabledSubmit?: boolean;
  width?: string;
  height?: string;
  hasSecondBtn?: boolean;
  submitBtnColor?: SubmitBtnColor;
  submitBtnVariant?: SubmitBtnVariant;
  secondBtnText?: string;
  onSecondBtnSubmit?: BtnSubmit;
  disabledSecondBtn?: boolean;
  sxProps?: SxProps;
  secondBtnStyles?: SxProps;
  hasThirdBtn?: boolean;
  thirdBtnText?: string;
  thirdBtnStyles?: SxProps;
  onThirdBtnSubmit?: BtnSubmit;
  footerStyles?: SxProps;
  hasActions?: boolean;
  submitBtnTooltip?: string;
  onTransitionEntered?: (node: HTMLElement, isAppearing: boolean) => void;
  hasCloseIcon?: boolean;
  'data-testid'?: string;
};
