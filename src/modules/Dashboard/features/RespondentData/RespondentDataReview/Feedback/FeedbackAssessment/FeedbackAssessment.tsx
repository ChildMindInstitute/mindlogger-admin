import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { assessmentActivityItems } from './mock';
import { ActivityCardItemList } from './ActivityCardItemList';
import { ActivityItemAnswers } from './FeedbackAssessment.types';
import { ActivityItem } from './ActivityCardItemList/ActivityCartItemList.types';
import { SubmitAssessmentPopup } from './SubmitAssessmentPopup';

const defaultValues = assessmentActivityItems.map((item) => ({
  activityItemId: item.id,
  answer: {
    value: item.answer,
  },
}));

export const FeedbackAssessment = () => {
  const methods = useForm<ActivityItemAnswers>({
    defaultValues: { answers: defaultValues },
    mode: 'onChange',
  });

  const [step, setStep] = useState(0);
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [submitAssessmentPopupVisible, setSubmitAssessmentPopupVisible] = useState(false);

  const toNextStep = () => {
    setStep(step + 1);
  };

  const toPrevStep = () => {
    setStep(step - 1);
  };

  const isSubmitVisible = step === assessmentActivityItems.length - 1;
  const isBackVisible = items.length > 1;

  useEffect(() => {
    setItems(assessmentActivityItems.slice(0, step + 1).reverse());
  }, [step]);

  return (
    <>
      <FormProvider {...methods}>
        <ActivityCardItemList
          step={step}
          items={items}
          isBackVisible={isBackVisible}
          isSubmitVisible={isSubmitVisible}
          toNextStep={toNextStep}
          toPrevStep={toPrevStep}
          onSubmit={() => setSubmitAssessmentPopupVisible(true)}
        />
        {
          <SubmitAssessmentPopup
            popupVisible={submitAssessmentPopupVisible}
            setPopupVisible={setSubmitAssessmentPopupVisible}
          />
        }
      </FormProvider>
    </>
  );
};
