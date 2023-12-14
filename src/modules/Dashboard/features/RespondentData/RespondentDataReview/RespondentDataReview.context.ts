import { createContext } from 'react';

import { RespondentDataReviewContextType } from './RespondentDataReview.types';

export const RespondentDataReviewContext = createContext<RespondentDataReviewContextType>({
  assessment: undefined,
  setAssessment: () => null,
  lastAssessment: null,
  assessmentVersions: [],
  isLastVersion: false,
  setIsLastVersion: () => null,
  isBannerVisible: false,
  setIsBannerVisible: () => null,
  itemIds: [],
  setItemIds: () => null,
  isFeedbackOpen: false,
});
