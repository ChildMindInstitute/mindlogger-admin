import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { assessmentActivityItems } from './mock';
import { ActivityCardItemList } from './ActivityCardItemList';

const defaultValues = assessmentActivityItems.map((item) => ({
  activityItemId: item.id,
  answer: {
    value: item.answer,
  },
}));

export const FeedbackAssessment = () => {
  const methods = useForm<{
    answers: {
      activityItemId: string;
      answer: {
        value: string[];
      };
    }[];
  }>({
    defaultValues: { answers: defaultValues },
    mode: 'onChange',
  });

  const [step, setStep] = useState(0);

  const toNextStep = () => {
    setStep(step + 1);
  };

  const toPrevStep = () => {
    setStep(step - 1);
  };

  const items = useMemo(() => assessmentActivityItems.slice(0, step + 1).reverse(), [step]);

  const isSubmitVisible = step === assessmentActivityItems.length - 1;
  const isBackVisible = items.length > 1;

  return (
    <FormProvider {...methods}>
      <ActivityCardItemList
        step={step}
        items={items}
        isBackVisible={isBackVisible}
        isSubmitVisible={isSubmitVisible}
        toNextStep={toNextStep}
        toPrevStep={toPrevStep}
        onSubmit={() => console.log(methods.getValues())}
      />
    </FormProvider>
  );
};
