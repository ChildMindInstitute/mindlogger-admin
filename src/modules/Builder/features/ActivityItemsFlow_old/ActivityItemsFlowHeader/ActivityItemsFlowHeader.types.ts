import { ReactNode } from 'react';

export type ActivityItemsFlowHeaderProps = {
  isSticky?: boolean;
  children: ReactNode;
  headerProps?: { isAddItemFlowDisabled?: boolean; onAddItemFlow?: () => void };
};
