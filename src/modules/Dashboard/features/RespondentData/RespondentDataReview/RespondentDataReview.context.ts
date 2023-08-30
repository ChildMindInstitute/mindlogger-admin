import { createContext } from 'react';

import { RespondentDataReviewContextType } from './RespondentDataReview.types';

export const RespondentDataReviewContext = createContext<RespondentDataReviewContextType>({
  assessment: undefined,
  itemIds: [],
  setItemIds: () => null,
  isFeedbackOpen: false,
});
