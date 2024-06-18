import { FormProvider, useForm } from 'react-hook-form';

import { LinkedTabs } from 'shared/components';

import { useRespondentDataSetup } from './RespondentData.hooks';
import { RespondentsDataFormValues } from './RespondentData.types';
import { defaultRespondentDataFormValues } from './RespondentData.const';
import { RespondentDataContextProvider } from './RespondentDataContext';

export const RespondentData = () => {
  const { respondentDataTabs } = useRespondentDataSetup();
  const methods = useForm<RespondentsDataFormValues>({
    defaultValues: defaultRespondentDataFormValues,
  });

  return (
    <FormProvider {...methods}>
      <RespondentDataContextProvider>
        <LinkedTabs tabs={respondentDataTabs} />
      </RespondentDataContextProvider>
    </FormProvider>
  );
};
