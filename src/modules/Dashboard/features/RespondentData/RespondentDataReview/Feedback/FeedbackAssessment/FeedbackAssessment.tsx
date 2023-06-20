import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Spinner } from 'shared/components';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { ActivityItemAnswer } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';
import { useAsync } from 'shared/hooks';
import { getAssessmentApi } from 'api';

import { StyledContainer } from './FeedbackAssessment.styles';
import { FeedbackAssessmentForm } from './FeedbackAssessmentForm';
import { FeedbackAssessmentProps } from './FeedbackAssessment.types';

export const FeedbackAssessment = ({ setActiveTab }: FeedbackAssessmentProps) => {
  const { appletId, answerId } = useParams();
  const getDecryptedActivityData = useDecryptedActivityData();
  const { execute: getAssessment, isLoading } = useAsync(getAssessmentApi);
  const [activityItemAnswers, setActivityItemAnswers] = useState<ActivityItemAnswer[]>([]);

  useEffect(() => {
    if (!appletId || !answerId) return;
    (async () => {
      const result = await getAssessment({ appletId, answerId });
      const { reviewerPublicKey, ...assessmentData } = result.data.result;
      const encryptedData = {
        ...assessmentData,
        userPublicKey: reviewerPublicKey,
      };
      const decryptedActivityData = getDecryptedActivityData(encryptedData);
      setActivityItemAnswers(decryptedActivityData.decryptedAnswers);
    })();
  }, []);

  return (
    <StyledContainer>
      {isLoading && <Spinner />}
      {!isLoading && !!activityItemAnswers.length && (
        <FeedbackAssessmentForm answers={activityItemAnswers} setActiveTab={setActiveTab} />
      )}
    </StyledContainer>
  );
};
