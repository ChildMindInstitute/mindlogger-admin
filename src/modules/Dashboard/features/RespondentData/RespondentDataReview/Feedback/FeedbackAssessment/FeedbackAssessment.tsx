import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import { auth } from 'redux/modules';
import { useEncryptedAnswers } from 'modules/Dashboard/hooks';
import { useAsync } from 'shared/hooks';
import { createAssessmentApi } from 'api';
import { FeedbackTabs } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/Feedback.const';

import { StyledContainer } from './FeedbackAssessment.styles';
import { FeedbackAssessmentProps } from './FeedbackAssessment.types';
import { formatAssessment } from './FeedbackAssessment.utils';
import { ActivityCardItemList } from './ActivityCardItemList';
import { SubmitAssessmentPopup } from './SubmitAssessmentPopup';

export const FeedbackAssessment = ({
  setActiveTab,
  assessment,
  assessmentStep,
  setAssessmentStep,
}: FeedbackAssessmentProps) => {
  const { appletId = '', answerId = '' } = useParams();
  const userData = auth.useData();
  const getEncryptedAnswers = useEncryptedAnswers();
  const { execute: createAssessment } = useAsync(createAssessmentApi, () =>
    setSubmitAssessmentPopupVisible(false),
  );

  const methods = useFormContext();
  const { getValues } = methods;

  const [submitAssessmentPopupVisible, setSubmitAssessmentPopupVisible] = useState(false);

  const { id: accountId = '' } = userData?.user || {};

  const toNextStep = () => {
    setAssessmentStep(assessmentStep + 1);
  };

  const toPrevStep = () => {
    setAssessmentStep(assessmentStep - 1);
  };

  const handleSubmitAssessment = async () => {
    const { assessmentItems } = getValues();
    const formattedAssessment = formatAssessment(assessmentItems);
    const answer = getEncryptedAnswers(formattedAssessment.answers) as string;

    await createAssessment({
      appletId,
      answerId,
      answer,
      itemIds: formattedAssessment.itemIds,
      reviewerPublicKey: accountId,
    });

    setActiveTab(FeedbackTabs.Reviewed);
    setAssessmentStep(0);
  };

  const activityItems = useMemo(() => {
    if (!assessment?.length) return [];

    return assessment.slice(0, assessmentStep + 1).reverse();
  }, [assessment, assessmentStep]);

  const isSubmitVisible = assessmentStep === assessment.length - 1;
  const isBackVisible = activityItems.length > 1;

  return (
    <StyledContainer>
      <ActivityCardItemList
        step={assessmentStep}
        activityItems={activityItems}
        isBackVisible={isBackVisible}
        isSubmitVisible={isSubmitVisible}
        toNextStep={toNextStep}
        toPrevStep={toPrevStep}
        onSubmit={() => {
          setSubmitAssessmentPopupVisible(true);
        }}
      />
      {submitAssessmentPopupVisible && (
        <SubmitAssessmentPopup
          popupVisible={submitAssessmentPopupVisible}
          setPopupVisible={setSubmitAssessmentPopupVisible}
          submitAssessment={handleSubmitAssessment}
        />
      )}
    </StyledContainer>
  );
};
