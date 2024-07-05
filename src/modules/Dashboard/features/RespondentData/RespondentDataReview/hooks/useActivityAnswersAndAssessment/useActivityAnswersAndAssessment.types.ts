import { Dispatch, MutableRefObject, SetStateAction } from 'react';

import { FeedbackTabs } from '../../RespondentDataReview.types';

export type ActivityAnswersAssessmentProps = {
  answerId: string | null;
  submitId: string | null;
  appletId?: string;
  setIsFeedbackOpen: Dispatch<SetStateAction<boolean>>;
  setActiveTab: Dispatch<SetStateAction<FeedbackTabs>>;
  containerRef: MutableRefObject<HTMLElement | null>;
};

export type GetAnswersAssessmentProps = {
  hasSelectedAnswer: boolean;
  activityId?: string;
  flowId?: string;
};
