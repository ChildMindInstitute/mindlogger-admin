import { Dispatch, SetStateAction } from 'react';

import { User } from 'modules/Auth/state';

export type UseFeedbackReviewsParams = {
  appletId?: string;
  answerId: string | null;
  submitId: string | null;
  user?: User;
  setAssessmentStep: Dispatch<SetStateAction<number>>;
};
