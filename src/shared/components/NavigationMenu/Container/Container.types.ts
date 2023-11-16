import { ReactNode } from 'react';

export type ActivitySettingsContainerProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};
