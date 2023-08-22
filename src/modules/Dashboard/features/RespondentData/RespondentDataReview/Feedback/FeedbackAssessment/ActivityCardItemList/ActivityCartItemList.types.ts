import { PropsWithChildren } from 'react';

import { AssessmentActivityItem } from 'modules/Dashboard/features/RespondentData/RespondentDataReview';

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
    activityItems: AssessmentActivityItem[];
  }>;
