import { ReactNode } from 'react';

import { ActivityFormValues } from 'modules/Builder/types';

export type ActivityFlowBuilderHeaderProps = {
  isSticky?: boolean;
  children: ReactNode;
  headerProps?: {
    activities?: ActivityFormValues[];
    clearFlowBtnDisabled?: boolean;
    onAddFlowActivity?: (key: string) => void;
    onClearFlow?: () => void;
  };
};
