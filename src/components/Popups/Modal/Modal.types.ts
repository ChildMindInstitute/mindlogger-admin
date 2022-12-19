import { BaseSyntheticEvent } from 'react';

type BtnSubmit =
  | ((e?: BaseSyntheticEvent | undefined) => Promise<void>)
  | ((value?: unknown) => void)
  | (() => void);

export type ModalProps = {
  open: boolean;
  title: string;
  buttonText: string;
  children: JSX.Element | null;
  onClose: () => void;
  onSubmit: BtnSubmit;
  titleAlign?: 'left' | 'right' | 'center';
  disabledSubmit?: boolean;
  width?: string;
  hasSecondBtn?: boolean;
  secondBtnText?: string;
  onSecondBtnSubmit?: BtnSubmit;
  disabledSecondBtn?: boolean;
};
