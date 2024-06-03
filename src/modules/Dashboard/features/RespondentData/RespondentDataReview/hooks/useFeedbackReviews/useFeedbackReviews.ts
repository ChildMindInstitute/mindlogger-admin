import { useCallback, useContext, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useAsync } from 'shared/hooks/useAsync';
import {
  getReviewsApi,
  getFlowReviewsApi,
  deleteReviewApi,
  deleteFlowReviewApi,
} from 'modules/Dashboard/api';
import { getErrorMessage } from 'shared/utils/errors';
import { RespondentDataReviewContext } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.context';
import { AssessmentActivityItem } from 'modules/Dashboard/features/RespondentData/RespondentDataReview';

import { useFeedbackReviewsData } from '../useFeedbackReviewsData/useFeedbackReviewsData';
import { UseFeedbackReviewsParams } from './useFeedbackReviews.types';
import { FeedbackForm } from '../../Feedback';
import { ReviewData } from '../../Feedback/FeedbackReviews/FeedbackReviews.types';
import { getDefaultFormValues, getReviewsErrorMessage } from '../../Feedback/utils';

export const useFeedbackReviews = ({
  appletId,
  answerId,
  submitId,
  user,
  setAssessmentStep,
}: UseFeedbackReviewsParams) => {
  const {
    assessment,
    lastAssessment,
    setAssessment,
    setIsLastVersion,
    isBannerVisible,
    setIsBannerVisible,
  } = useContext(RespondentDataReviewContext);

  const { reset } = useFormContext<FeedbackForm>();

  const [reviewersData, setReviewersData] = useState<ReviewData[]>([]);
  const [removeReviewsLoading, setRemoveReviewsLoading] = useState<boolean>(false);
  const [removeReviewError, setRemoveReviewError] = useState<string | null>(null);

  const { fetchReviewsData } = useFeedbackReviewsData();

  const getReviewsAsync = useAsync(getReviewsApi, async (result) => {
    const reviewsData = await fetchReviewsData({
      reviews: result?.data?.result ?? [],
      userId: user?.id ?? '',
    });
    setReviewersData(reviewsData);
  });

  const getFlowReviewsAsync = useAsync(getFlowReviewsApi, async (result) => {
    const reviewsData = await fetchReviewsData({
      reviews: result?.data?.result ?? [],
      userId: user?.id ?? '',
    });
    setReviewersData(reviewsData);
  });

  const { execute: getReviews, isLoading: reviewsLoading, error: reviewsError } = getReviewsAsync;
  const {
    execute: getFlowReviews,
    isLoading: reviewsFlowLoading,
    error: reviewsFlowError,
  } = getFlowReviewsAsync;

  const updateAssessment = (updatedAssessment: AssessmentActivityItem[]) => {
    setAssessment(updatedAssessment);
    reset(getDefaultFormValues(updatedAssessment));
    setAssessmentStep(0);
  };

  const handleSelectLastVersion = () => {
    setIsLastVersion(true);
    setIsBannerVisible(false);

    const updatedAssessment = lastAssessment?.map((activityItem) => ({
      activityItem,
      answer: undefined,
    })) as AssessmentActivityItem[];
    updateAssessment(updatedAssessment);
  };

  const handleGetReviews = useCallback(async () => {
    if (!appletId) return;

    if (answerId) {
      await getReviews({ appletId, answerId });
    } else if (submitId) {
      await getFlowReviews({ appletId, submitId });
    }
  }, [appletId, answerId, submitId, getReviews, getFlowReviews]);

  const handleReviewerAnswersRemove = async (assessmentId: string) => {
    if (!appletId || (!answerId && !submitId)) return;

    if (answerId) {
      try {
        setRemoveReviewsLoading(true);
        setRemoveReviewError(null);

        await deleteReviewApi({ appletId, answerId, assessmentId });
      } catch (error) {
        setRemoveReviewError(getErrorMessage(error));
      } finally {
        setRemoveReviewsLoading(false);
      }
    } else if (submitId) {
      try {
        setRemoveReviewsLoading(true);
        setRemoveReviewError(null);

        await deleteFlowReviewApi({ appletId, submitId, assessmentId });
      } catch (error) {
        setRemoveReviewError(getErrorMessage(error));
      } finally {
        setRemoveReviewsLoading(false);
      }
    }

    if (lastAssessment?.length) {
      handleSelectLastVersion();
    } else {
      const updatedAssessment = assessment?.map(({ activityItem, items }) => ({
        activityItem,
        answer: undefined,
        items,
      })) as AssessmentActivityItem[];
      updateAssessment(updatedAssessment);
    }
    handleGetReviews();
  };

  return {
    isBannerVisible,
    setIsBannerVisible,
    reviewersData,
    reviewsLoading: reviewsLoading || reviewsFlowLoading,
    reviewsError: getReviewsErrorMessage(reviewsError, reviewsFlowError),
    removeReviewsLoading,
    removeReviewError,
    handleGetReviews,
    handleReviewerAnswersRemove,
  };
};
