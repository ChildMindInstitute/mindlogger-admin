import { useCallback, useState } from 'react';

import { useAsync } from 'shared/hooks/useAsync';
import {
  getReviewsApi,
  getFlowReviewsApi,
  deleteReviewApi,
  deleteFlowReviewApi,
} from 'modules/Dashboard/api';
import { getErrorMessage } from 'shared/utils/errors';

import { useFeedbackReviewsData } from './useFeedbackReviewsData';
import { ReviewData } from '../FeedbackReviews.types';

type UseFeedbackReviewsParams = {
  appletId: string | undefined;
  answerId: string | null;
  submitId: string | null;
  user: { id: string; firstName: string; lastName: string } | undefined;
};

type UseFeedbackReviewsReturn = {
  reviewerData: ReviewData[];
  reviewsLoading: boolean;
  reviewsFlowLoading: boolean;
  reviewError: string | null;
  reviewsFlowError: string | null;
  removeReviewLoading: boolean;
  removeReviewError: string | null;
  removeReviewsFlowError: string | null;
  handleGetReviews: () => Promise<void>;
  handleReviewerAnswersRemove: (assessmentId: string) => Promise<void>;
};

export const useFeedbackReviews = ({
  appletId,
  answerId,
  submitId,
  user,
}: UseFeedbackReviewsParams): UseFeedbackReviewsReturn => {
  const [reviewerData, setreviewerData] = useState<ReviewData[]>([]);
  const [removeReviewLoading, setremoveReviewLoading] = useState<boolean>(false);
  const [removeReviewError, setremoveReviewError] = useState<string | null>(null);
  const [removeReviewsFlowLoading, setRemoveReviewsFlowLoading] = useState<boolean>(false);
  const [removeReviewsFlowError, setRemoveReviewsFlowError] = useState<string | null>(null);

  const { fetchReviewsData } = useFeedbackReviewsData();

  const getReviewsAsync = useAsync(getReviewsApi, async (result) => {
    const reviewsData = await fetchReviewsData({
      reviews: result?.data?.result ?? [],
      userId: user?.id ?? '',
    });
    setreviewerData(reviewsData);
  });

  const getFlowReviewsAsync = useAsync(getFlowReviewsApi, async (result) => {
    const reviewsData = await fetchReviewsData({
      reviews: result?.data?.result ?? [],
      userId: user?.id ?? '',
    });
    setreviewerData(reviewsData);
  });

  const { execute: getReviews, isLoading: reviewsLoading, error: reviewError } = getReviewsAsync;
  const {
    execute: getFlowReviews,
    isLoading: reviewsFlowLoading,
    error: reviewsFlowError,
  } = getFlowReviewsAsync;

  const handleGetReviews = useCallback(async () => {
    if (!appletId) return;

    if (answerId) {
      await getReviews({ appletId, answerId });
    } else if (submitId) {
      await getFlowReviews({ appletId, submitId });
    }
  }, [appletId, answerId, submitId, getReviews, getFlowReviews]);

  const handleReviewerAnswersRemove = async (assessmentId: string) => {
    if (!appletId) return;

    setremoveReviewLoading(true);
    setremoveReviewError(null);

    try {
      if (answerId) {
        await deleteReviewApi({ appletId, answerId, assessmentId });
      } else if (submitId) {
        await deleteFlowReviewApi({ appletId, submitId, assessmentId });
      }
      await handleGetReviews();
    } catch (error) {
      setremoveReviewError(getErrorMessage(error));
    } finally {
      setremoveReviewLoading(false);
    }
  };

  return {
    reviewerData,
    reviewsLoading,
    reviewsFlowLoading,
    reviewError: reviewError ? getErrorMessage(reviewError) : null,
    reviewsFlowError: reviewsFlowError ? getErrorMessage(reviewsFlowError) : null,
    removeReviewLoading,
    removeReviewError: removeReviewError ? getErrorMessage(removeReviewError) : null,
    removeReviewsFlowError: removeReviewsFlowError ? getErrorMessage(removeReviewsFlowError) : null,
    handleGetReviews,
    handleReviewerAnswersRemove,
  };
};
