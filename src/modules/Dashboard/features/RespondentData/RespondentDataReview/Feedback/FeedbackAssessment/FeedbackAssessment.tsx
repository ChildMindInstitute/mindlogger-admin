import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { ActivityItemAnswer } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

import { assessmentActivityItems } from './mock';
import { ActivityCardItemList } from './ActivityCardItemList';
import { ActivityItemAnswers } from './FeedbackAssessment.types';
import { SubmitAssessmentPopup } from './SubmitAssessmentPopup';
import { StyledContainer } from './FeedbackAssessment.styles';
import { getDefaultValue } from './FeedbackAssessment.utils';

const defaultValues = assessmentActivityItems.map(({ activityItem, answer }) => ({
  activityItemId: activityItem.id,
  answer: {
    value: answer.value || getDefaultValue(activityItem.responseType),
  },
}));

export const FeedbackAssessment = () => {
  const methods = useForm<ActivityItemAnswers>({
    defaultValues: { answers: defaultValues },
    mode: 'onChange',
  });

  const [step, setStep] = useState(0);
  const [activityItems, setActivityItems] = useState<ActivityItemAnswer[]>([]);
  const [submitAssessmentPopupVisible, setSubmitAssessmentPopupVisible] = useState(false);

  const toNextStep = () => {
    setStep(step + 1);
  };

  const toPrevStep = () => {
    setStep(step - 1);
  };

  const isSubmitVisible = step === assessmentActivityItems.length - 1;
  const isBackVisible = activityItems.length > 1;

  useEffect(() => {
    setActivityItems(assessmentActivityItems.slice(0, step + 1).reverse());
  }, [step]);

  return (
    <StyledContainer>
      <FormProvider {...methods}>
        <ActivityCardItemList
          step={step}
          activityItems={activityItems}
          isBackVisible={isBackVisible}
          isSubmitVisible={isSubmitVisible}
          toNextStep={toNextStep}
          toPrevStep={toPrevStep}
          onSubmit={() => {
            console.log(methods.getValues());
            setSubmitAssessmentPopupVisible(true);
          }}
        />
        {submitAssessmentPopupVisible && (
          <SubmitAssessmentPopup
            popupVisible={submitAssessmentPopupVisible}
            setPopupVisible={setSubmitAssessmentPopupVisible}
          />
        )}
      </FormProvider>
    </StyledContainer>
  );
};
