import { AxiosError } from 'axios';

import { ApiErrorResponse } from 'shared/state/Base';
import { getErrorMessage } from 'shared/utils';

export const getReviewsErrorMessage = (
  reviewsError: AxiosError<ApiErrorResponse> | null,
  reviewsFlowError: AxiosError<ApiErrorResponse> | null,
) => {
  if (reviewsError) {
    return getErrorMessage(reviewsError);
  }

  if (reviewsFlowError) {
    return getErrorMessage(reviewsFlowError);
  }

  return null;
};
