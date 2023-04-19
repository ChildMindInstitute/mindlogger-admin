import { PropsWithChildren } from 'react';

import { ActivityItemAnswer } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

export type ButtonsConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
};

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
