import { ReactNode } from 'react';

export type ContainerHeaderProps = {
  isSticky?: boolean;
  headerProps?: {
    onClose?: () => void;
  };
  children: ReactNode;
};
