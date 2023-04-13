import { ReactNode } from 'react';

export type ActivityFlowBuilderHeaderProps = {
  isSticky?: boolean;
  children: ReactNode;
  headerProps?: {
    clearFlowBtnDisabled?: boolean;
    onAddFlowActivity?: (key: string) => void;
    onClearFlow?: () => void;
  };
};
