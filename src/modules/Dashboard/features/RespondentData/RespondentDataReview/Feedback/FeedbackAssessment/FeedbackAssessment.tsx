import { useState, useMemo, useContext } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import { auth } from 'redux/modules';
import { useEncryptedAnswers } from 'modules/Dashboard/hooks';
import { useAsync } from 'shared/hooks';
import { createAssessmentApi } from 'api';
import { FeedbackTabs } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/Feedback.const';
import { RespondentDataReviewContext } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/context';

import { StyledContainer } from './FeedbackAssessment.styles';
import { FeedbackAssessmentProps } from './FeedbackAssessment.types';
import { formatAssessmentAnswers } from './FeedbackAssessment.utils';
import { ActivityCardItemList } from './ActivityCardItemList';
import { SubmitAssessmentPopup } from './SubmitAssessmentPopup';

export const FeedbackAssessment = ({
  setActiveTab,
  assessmentStep,
  setAssessmentStep,
}: FeedbackAssessmentProps) => {
  const { assessment, itemIds } = useContext(RespondentDataReviewContext);
  const { appletId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const answerId = searchParams.get('answerId');
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
    const answers = formatAssessmentAnswers(assessmentItems);
    const answer = getEncryptedAnswers(answers) as string;

    if (!appletId || !answerId) return;

    await createAssessment({
      appletId,
      answerId,
      answer,
      itemIds: itemIds || [],
      reviewerPublicKey: accountId,
    });

    methods.reset({
      newNote: '',
      assessmentItems,
    });
    setActiveTab(FeedbackTabs.Reviewed);
    setAssessmentStep(0);
  };

  const activityItems = useMemo(() => {
    if (!assessment?.length) return [];

    return assessment.slice(0, assessmentStep + 1).reverse();
  }, [assessment, assessmentStep]);

  const isSubmitVisible = assessmentStep === assessment!.length - 1;
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
