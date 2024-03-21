import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';

import { LinkedTabs } from 'shared/components';
import { users, workspaces } from 'redux/modules';
import { useAppDispatch } from 'redux/store';

import { useRespondentDataTabs } from './RespondentData.hooks';
import { RespondentsDataFormValues } from './RespondentData.types';
import { defaultRespondentDataFormValues } from './RespondentData.const';

export const RespondentData = () => {
  const { appletId, respondentId } = useParams();
  const dispatch = useAppDispatch();

  const { ownerId } = workspaces.useData() || {};
  const respondentDataTabs = useRespondentDataTabs();
  const methods = useForm<RespondentsDataFormValues>({
    defaultValues: defaultRespondentDataFormValues,
  });

  useEffect(() => {
    if (!appletId || !respondentId || !ownerId) return;

    const { getRespondentDetails } = users.thunk;

    dispatch(
      getRespondentDetails({
        ownerId,
        appletId,
        respondentId,
      }),
    );
  }, [appletId, respondentId, ownerId, dispatch]);

  return (
    <FormProvider {...methods}>
      <LinkedTabs tabs={respondentDataTabs} />
    </FormProvider>
  );
};
