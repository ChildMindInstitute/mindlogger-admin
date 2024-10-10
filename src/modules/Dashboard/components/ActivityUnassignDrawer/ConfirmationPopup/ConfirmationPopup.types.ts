import { ReactNode } from 'react';

export type ConfirmationPopupProps = {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body: ReactNode;
  isLoading: boolean;
  'data-testid': string;
};
