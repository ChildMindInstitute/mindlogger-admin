import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Spinner } from 'shared/components';
import { useDecryptedReviews } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Review/Review.hooks';
import { Activity } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';
import { ActivityItemAnswer } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';
import { useAsync } from 'shared/hooks';
import { getAssessmentApi } from 'api';

import { StyledContainer } from './FeedbackAssessment.styles';
import { FeedbackAssessmentForm } from './FeedbackAssessmentForm';

export const FeedbackAssessment = ({ activity }: { activity: Activity }) => {
  const { t } = useTranslation('app');
  const { appletId, answerId } = useParams();
  const getDecryptedReviews = useDecryptedReviews();
  const { execute: getActivityAnswer, isLoading } = useAsync(getAssessmentApi);
  const [activityItemAnswers, setActivityItemAnswers] = useState<ActivityItemAnswer[]>([]);

  useEffect(() => {
    if (!appletId || !answerId) return;
    (async () => {
      const result = await getActivityAnswer({ appletId, answerId, activityId: activity.id });
      const items = getDecryptedReviews(result.data.result);
      setActivityItemAnswers(items);
    })();
  }, []);

  return (
    <StyledContainer>
      {isLoading && <Spinner />}
      {!isLoading && !activityItemAnswers.length && t('noData')}
      {!isLoading && !!activityItemAnswers.length && (
        <FeedbackAssessmentForm answers={activityItemAnswers} activityId={activity.id} />
      )}
    </StyledContainer>
  );
};
