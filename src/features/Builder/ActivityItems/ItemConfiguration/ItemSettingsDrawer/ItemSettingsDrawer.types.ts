import { ReactNode } from 'react';

export type ItemSettingsDrawerProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};
