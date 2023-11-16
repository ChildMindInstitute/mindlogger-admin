import { useState, useMemo, useContext } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import { auth } from 'redux/modules';
import { useEncryptedAnswers } from 'modules/Dashboard/hooks';
import { useAsync } from 'shared/hooks/useAsync';
import { createAssessmentApi } from 'api';
import { RespondentDataReviewContext } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.context';

import { AssessmentFormItem, FeedbackForm } from '../Feedback.types';
import { FeedbackTabs } from './FeedbackAssessment.const';
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
  const { assessment, itemIds, setItemIds } = useContext(RespondentDataReviewContext);
  const { appletId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const answerId = searchParams.get('answerId');
  const userData = auth.useData();
  const getEncryptedAnswers = useEncryptedAnswers();
  const { execute: createAssessment } = useAsync(createAssessmentApi, () =>
    setSubmitAssessmentPopupVisible(false),
  );

  const methods = useFormContext<FeedbackForm>();
  const {
    getValues,
    formState: { defaultValues },
  } = methods;

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
    const { answers, updatedItemIds } = formatAssessmentAnswers(
      defaultValues?.assessmentItems as AssessmentFormItem[],
      assessmentItems,
      itemIds,
    );

    const answersToEncrypt = answers.map(({ answer }) => answer);

    if (!getEncryptedAnswers) return;

    const answer = getEncryptedAnswers(answersToEncrypt);

    if (!appletId || !answerId) return;

    setItemIds(updatedItemIds);

    await createAssessment({
      appletId,
      answerId,
      answer,
      itemIds: updatedItemIds || [],
      reviewerPublicKey: accountId,
    });

    methods.reset({
      newNote: '',
      assessmentItems: answers.map(({ answer, itemId }) => ({
        itemId,
        answers: answer.value,
        edited: answer.edited,
      })),
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
