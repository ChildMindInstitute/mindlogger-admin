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
import { UseFeedbackReviewsParams } from './useFeedbackReviews.types';

export const useFeedbackReviews = ({
  appletId,
  answerId,
  submitId,
  user,
}: UseFeedbackReviewsParams) => {
  const [reviewerData, setReviewerData] = useState<ReviewData[]>([]);
  const [removeReviewsLoading, setRemoveReviewsLoading] = useState<boolean>(false);
  const [removeReviewsError, setRemoveReviewsError] = useState<string | null>(null);
  const [removeReviewsFlowLoading, setRemoveReviewsFlowLoading] = useState<boolean>(false);
  const [removeReviewsFlowError, setRemoveReviewsFlowError] = useState<string | null>(null);

  const { fetchReviewsData } = useFeedbackReviewsData();

  const getReviewsAsync = useAsync(getReviewsApi, async (result) => {
    const reviewsData = await fetchReviewsData({
      reviews: result?.data?.result ?? [],
      userId: user?.id ?? '',
    });
    setReviewerData(reviewsData);
  });

  const getFlowReviewsAsync = useAsync(getFlowReviewsApi, async (result) => {
    const reviewsData = await fetchReviewsData({
      reviews: result?.data?.result ?? [],
      userId: user?.id ?? '',
    });
    setReviewerData(reviewsData);
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
    if (answerId) {
      try {
        setRemoveReviewsLoading(true);
        setRemoveReviewsError(null);

        await deleteReviewApi({ appletId, answerId, assessmentId });
      } catch (error) {
        setRemoveReviewsError(getErrorMessage(error));
      } finally {
        setRemoveReviewsLoading(false);
      }
    } else if (submitId) {
      try {
        setRemoveReviewsFlowLoading(true);
        setRemoveReviewsFlowError(null);

        await deleteFlowReviewApi({ appletId, submitId, assessmentId });
      } catch (error) {
        setRemoveReviewsFlowError(getErrorMessage(error));
      } finally {
        setRemoveReviewsFlowLoading(false);
      }
    }
  };

  return {
    reviewerData,
    reviewsLoading,
    reviewsFlowLoading,
    reviewsError: reviewError ? getErrorMessage(reviewError) : null,
    reviewsFlowsError: reviewsFlowError ? getErrorMessage(reviewsFlowError) : null,
    removeReviewsLoading,
    removeReviewsFlowLoading,
    removeReviewsError: removeReviewsError ? getErrorMessage(removeReviewsError) : null,
    removeReviewsFlowError: removeReviewsFlowError ? getErrorMessage(removeReviewsFlowError) : null,
    handleGetReviews,
    handleReviewerAnswersRemove,
  };
};
