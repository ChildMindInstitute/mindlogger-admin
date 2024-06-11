import { createContext } from 'react';

import { nullReturnFunc } from 'shared/utils';

import { RespondentDataReviewContextType } from './RespondentDataReview.types';

export const RespondentDataReviewContext = createContext<RespondentDataReviewContextType>({
  assessment: undefined,
  setAssessment: nullReturnFunc,
  lastAssessment: null,
  assessmentVersions: [],
  isLastVersion: false,
  setIsLastVersion: nullReturnFunc,
  isBannerVisible: false,
  setIsBannerVisible: nullReturnFunc,
  itemIds: [],
  setItemIds: nullReturnFunc,
  isFeedbackOpen: false,
});
