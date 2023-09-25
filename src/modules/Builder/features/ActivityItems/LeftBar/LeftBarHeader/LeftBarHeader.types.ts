import { ReactNode } from 'react';

export type LeftBarHeaderProps = {
  isSticky?: boolean;
  children: ReactNode;
  headerProps?: {
    hasActiveItem?: boolean;
    onAddItem?: () => void;
  };
};
