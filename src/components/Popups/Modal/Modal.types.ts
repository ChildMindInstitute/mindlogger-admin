import { BaseSyntheticEvent } from 'react';

export type ModalProps = {
  open: boolean;
  title: string;
  buttonText: string;
  children: JSX.Element;
  onClose: () => void;
  onSubmit: ((e?: BaseSyntheticEvent | undefined) => Promise<void>) | ((value?: unknown) => void);
  titleAlign?: 'left' | 'right' | 'center';
  disabledSubmit?: boolean;
};
