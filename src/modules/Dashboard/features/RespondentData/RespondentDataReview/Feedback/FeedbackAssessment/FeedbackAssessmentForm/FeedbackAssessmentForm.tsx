import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';

import { auth } from 'redux/modules';
import { useEncryptedAnswers } from 'modules/Dashboard/hooks';
import { useAsync } from 'shared/hooks';
import { createAssessmentApi } from 'api';
import { FeedbackTabs } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/Feedback.const';

import { formatAssessment, getAnswerValue, getDefaultValue } from './FeedbackAssessmentForm.utils';
import { ActivityCardItemList } from '../ActivityCardItemList';
import { SubmitAssessmentPopup } from './SubmitAssessmentPopup';
import { FeedbackAssessmentFormProps, AssessmentForm } from './FeedbackAssessmentForm.types';

export const FeedbackAssessmentForm = ({ answers, setActiveTab }: FeedbackAssessmentFormProps) => {
  const { appletId = '', answerId = '' } = useParams();
  const userData = auth.useData();
  const encryptedAnswers = useEncryptedAnswers();
  const { execute: createAssessment } = useAsync(createAssessmentApi, () =>
    setSubmitAssessmentPopupVisible(false),
  );

  const methods = useForm<AssessmentForm>({
    mode: 'onChange',
    defaultValues: {
      assessmentItems: answers?.map(({ activityItem, answer }) => ({
        itemId: activityItem.id as string,
        answers: getAnswerValue(answer) || getDefaultValue(activityItem.responseType),
      })),
    },
  });

  const [step, setStep] = useState(0);
  const [submitAssessmentPopupVisible, setSubmitAssessmentPopupVisible] = useState(false);

  const { id: accountId = '' } = userData?.user || {};

  const toNextStep = () => {
    setStep(step + 1);
  };

  const toPrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmitAssessment = async () => {
    const { getValues } = methods;
    const { assessmentItems } = getValues();
    const formattedAssessment = formatAssessment(assessmentItems);
    const answer = encryptedAnswers(formattedAssessment.answers) as string;

    await createAssessment({
      appletId,
      answerId,
      answer,
      itemIds: formattedAssessment.itemIds,
      reviewerPublicKey: accountId,
    });

    setActiveTab(FeedbackTabs.Reviewed);
  };

  const activityItems = useMemo(() => {
    if (!answers?.length) return [];

    return answers.slice(0, step + 1).reverse();
  }, [answers, step]);

  const isSubmitVisible = step === answers.length - 1;
  const isBackVisible = activityItems.length > 1;

  return (
    <>
      <FormProvider {...methods}>
        <ActivityCardItemList
          step={step}
          activityItems={activityItems}
          isBackVisible={isBackVisible}
          isSubmitVisible={isSubmitVisible}
          toNextStep={toNextStep}
          toPrevStep={toPrevStep}
          onSubmit={() => {
            setSubmitAssessmentPopupVisible(true);
          }}
        />
      </FormProvider>
      {submitAssessmentPopupVisible && (
        <SubmitAssessmentPopup
          popupVisible={submitAssessmentPopupVisible}
          setPopupVisible={setSubmitAssessmentPopupVisible}
          submitAssessment={handleSubmitAssessment}
        />
      )}
    </>
  );
};
