import { useContext, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { auth } from 'modules/Auth/state';

import { StyledContainer } from './FeedbackReviews.styles';
import { useFeedbackReviews } from './hooks/useFeedbackReviews';
import { FeedbackAssessment } from '../FeedbackAssessment';
import { AssessmentBanner } from './AssessmentBanner';
import { AddReview } from './AddReview';
import { Reviews } from './Reviews';
import { RespondentDataReviewContext } from '../../RespondentDataReview.context';

export const FeedbackReviews = () => {
  const { t } = useTranslation('app');
  const { appletId } = useParams<{ appletId: string }>();
  const [searchParams] = useSearchParams();
  const answerId = searchParams.get('answerId') || null;
  const submitId = searchParams.get('submitId') || null;

  const [assessmentStep, setAssessmentStep] = useState(0);
  const [submitAssessmentLoading, setSubmitAssessmentLoading] = useState(false);
  const [submitAssessmentError, setSubmitAssessmentError] = useState<string | null>(null);
  const [showFeedbackAssessment, setShowFeedbackAssessment] = useState(false);

  const { user } = auth.useData() ?? {};

  const { isBannerVisible, setIsBannerVisible } = useContext(RespondentDataReviewContext);

  const {
    reviewerData,
    reviewsLoading,
    reviewsError,
    removeReviewsLoading,
    removeReviewsError,
    handleGetReviews,
    handleReviewerAnswersRemove,
  } = useFeedbackReviews({ appletId, answerId, submitId, user });

  const userName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}${t('me')}`;
  const dataTestid = 'respondents-data-summary-feedback-reviewed';

  const handleReviewEdit = () => {
    setShowFeedbackAssessment(true);
  };

  const hasCurrentUserReview = reviewerData.some(
    ({ isCurrentUserReviewer }) => isCurrentUserReviewer,
  );
  const isLoading = reviewsLoading || submitAssessmentLoading;
  const isAddReviewVisible = !hasCurrentUserReview && !isLoading && !showFeedbackAssessment;
  const isFeedbackAssessmentVisible = showFeedbackAssessment && !isLoading;
  const isAssessmentBannerVisible =
    isBannerVisible && !isAddReviewVisible && !isFeedbackAssessmentVisible;

  const handleAddReviewClick = () => setShowFeedbackAssessment(true);

  const submitAssessmentCallback = () => {
    setShowFeedbackAssessment(false);
    handleGetReviews();
  };

  useEffect(() => {
    handleGetReviews();
  }, [handleGetReviews]);

  return (
    <StyledContainer data-testid={dataTestid}>
      {isAssessmentBannerVisible && (
        <AssessmentBanner
          isBannerVisible={isAssessmentBannerVisible}
          onClose={() => setIsBannerVisible(false)}
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
          setError={setSubmitAssessmentError}
          error={submitAssessmentError}
          userName={userName}
        />
      )}
      <Reviews
        isLoading={isLoading}
        reviewError={reviewsError}
        reviewerData={reviewerData}
        removeReviewsError={removeReviewsError}
        removeReviewsLoading={removeReviewsLoading}
        onReviewerAnswersRemove={handleReviewerAnswersRemove}
        onReviewEdit={handleReviewEdit}
        data-testid={dataTestid}
      />
    </StyledContainer>
  );
};
