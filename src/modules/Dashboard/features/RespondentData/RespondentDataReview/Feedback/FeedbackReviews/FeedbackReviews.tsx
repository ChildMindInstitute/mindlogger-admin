import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { useAsync } from 'shared/hooks/useAsync';
import { AssessmentId, deleteReviewApi, getReviewsApi } from 'modules/Dashboard/api';
import { getErrorMessage } from 'shared/utils/errors';
import { auth } from 'modules/Auth/state';

import { StyledContainer } from './FeedbackReviews.styles';
import { ReviewData } from './FeedbackReviews.types';
import { useFeedbackReviewsData } from './FeedbackReviews.hooks';
import { FeedbackAssessment } from '../FeedbackAssessment';
import { RespondentDataReviewContext } from '../../RespondentDataReview.context';
import { AssessmentBanner } from './AssessmentBanner';
import { AssessmentActivityItem } from '../../RespondentDataReview.types';
import { getDefaultFormValues } from '../Feedback.utils';
import { FeedbackForm } from '../Feedback.types';
import { AddReview } from './AddReview';
import { Reviews } from './Reviews';

export const FeedbackReviews = () => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const [searchParams] = useSearchParams();
  const answerId = searchParams.get('answerId');
  const [reviewersData, setReviewersData] = useState<ReviewData[]>([]);
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [submitAssessmentLoading, setSubmitAssessmentLoading] = useState(false);
  const [submitAssessmentError, setSubmitAssessmentError] = useState<string | null>(null);
  const [showFeedbackAssessment, setShowFeedbackAssessment] = useState(false);

  const { reset } = useFormContext<FeedbackForm>();
  const { user } = auth.useData() ?? {};
  const { setAssessment, lastAssessment, setIsLastVersion, isBannerVisible, setIsBannerVisible } =
    useContext(RespondentDataReviewContext);
  const getFeedbackReviewsData = useFeedbackReviewsData();

  const userName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}${t('me')}`;
  const dataTestid = 'respondents-data-summary-feedback-reviewed';

  const {
    execute: getReviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useAsync(getReviewsApi, async (result) => {
    const reviewsData = await getFeedbackReviewsData({
      reviews: result?.data?.result ?? [],
      userId: user?.id ?? '',
    });

    setReviewersData(reviewsData);
  });

  const {
    execute: removeReview,
    isLoading: removeReviewLoading,
    error: removeReviewError,
  } = useAsync(deleteReviewApi);

  const handleSelectLastVersion = () => {
    if (!lastAssessment?.length) return;

    setIsLastVersion(true);
    setIsBannerVisible(false);

    const updatedAssessment = lastAssessment.map((activityItem) => ({
      activityItem,
      answer: undefined,
    })) as AssessmentActivityItem[];
    setAssessment(updatedAssessment);
    reset(getDefaultFormValues(updatedAssessment));
    setAssessmentStep(0);
  };

  const handleAssessmentBannerClose = () => setIsBannerVisible(false);

  const handleReviewerAnswersRemove = async ({ assessmentId }: AssessmentId) => {
    if (!appletId || !answerId) return;
    await removeReview({ appletId, answerId, assessmentId });
    handleSelectLastVersion();

    getReviews({ appletId, answerId });
  };

  const hasCurrentUserReview = reviewersData.some(
    ({ isCurrentUserReviewer }) => isCurrentUserReviewer,
  );
  const isLoading = reviewsLoading || submitAssessmentLoading;
  const isAddReviewVisible = !hasCurrentUserReview && !isLoading && !showFeedbackAssessment;
  const isFeedbackAssessmentVisible = showFeedbackAssessment && !isLoading;
  const isAssessmentBannerVisible =
    isBannerVisible && !isAddReviewVisible && !isFeedbackAssessmentVisible;

  const handleAddReviewClick = () => setShowFeedbackAssessment(true);

  const handleGetReviews = useCallback(() => {
    if (!appletId || !answerId) return;

    getReviews({ appletId, answerId });
  }, [answerId, appletId, getReviews]);

  const submitAssessmentCallback = () => {
    setShowFeedbackAssessment(false);
    handleGetReviews();
  };

  useEffect(() => {
    handleGetReviews();
  }, [handleGetReviews]);

  return (
    <StyledContainer>
      {isAssessmentBannerVisible && (
        <AssessmentBanner
          isBannerVisible={isAssessmentBannerVisible}
          onClose={handleAssessmentBannerClose}
        />
      )}
      {isAddReviewVisible && (
        <AddReview
          onAddReview={handleAddReviewClick}
          userName={userName}
          data-testid={dataTestid}
        />
      )}
      {isFeedbackAssessmentVisible && (
        <FeedbackAssessment
          assessmentStep={assessmentStep}
          setAssessmentStep={setAssessmentStep}
          submitCallback={submitAssessmentCallback}
          setIsLoading={setSubmitAssessmentLoading}
          answerId={answerId}
          setError={setSubmitAssessmentError}
          error={submitAssessmentError}
          userName={userName}
        />
      )}
      <Reviews
        isLoading={isLoading}
        reviewsError={reviewsError ? getErrorMessage(reviewsError) : null}
        reviewersData={reviewersData}
        removeReviewError={removeReviewError ? getErrorMessage(removeReviewError) : null}
        removeReviewLoading={removeReviewLoading}
        onReviewerAnswersRemove={handleReviewerAnswersRemove}
        data-testid={dataTestid}
      />
    </StyledContainer>
  );
};
