import { Dispatch, SetStateAction } from 'react';

export type Steps = 0 | 1;

export type RemoveImagePopupProps = {
  open: boolean;
  onClose: () => void;
  onRemove: () => void;
  'data-testid'?: string;
};

export type ScreenParams = {
  onClose: () => void;
  onRemove: () => void;
  setStep: Dispatch<SetStateAction<Steps>>;
};
