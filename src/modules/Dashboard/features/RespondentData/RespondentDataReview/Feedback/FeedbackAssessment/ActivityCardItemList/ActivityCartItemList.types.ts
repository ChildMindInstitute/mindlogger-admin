import { PropsWithChildren } from 'react';

import { ActivityItemAnswer } from 'shared/types';

export type ActivityCartProps = {
  step: number;
  isBackVisible: boolean;
  isSubmitVisible: boolean;
  onSubmit: () => void;
  toNextStep?: () => void;
  toPrevStep?: () => void;
};

export type ActivityCardItemListProps = ActivityCartProps &
  PropsWithChildren<{
    activityItems: ActivityItemAnswer[];
  }>;
