import { FormProvider, useForm } from 'react-hook-form';

import { LinkedTabs } from 'shared/components';

import { useRespondentDataSetup } from './RespondentData.hooks';
import { RespondentsDataFormValues } from './RespondentData.types';
import { defaultRespondentDataFormValues } from './RespondentData.const';

export const RespondentData = () => {
  const { respondentDataTabs } = useRespondentDataSetup();
  const methods = useForm<RespondentsDataFormValues>({
    defaultValues: defaultRespondentDataFormValues,
  });

  return (
    <FormProvider {...methods}>
      <LinkedTabs tabs={respondentDataTabs} />
    </FormProvider>
  );
};
