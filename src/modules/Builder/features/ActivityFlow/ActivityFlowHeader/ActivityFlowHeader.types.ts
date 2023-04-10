import { ReactNode } from 'react';

export type ActivityFlowHeaderProps = {
  isSticky?: boolean;
  children: ReactNode;
  headerProps?: { onAddActivityFlow?: () => void };
};
