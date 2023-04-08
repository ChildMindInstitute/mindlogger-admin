import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'redux/store';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { SaveAndPublish } from 'modules/Builder/features';
import { LinkedTabs } from 'shared/components';
import {
  useBuilderSessionStorageFormValues,
  useBuilderSessionStorageFormChange,
  useCheckIfNewApplet,
} from 'shared/hooks';
import { StyledBody } from 'shared/styles/styledComponents';
import { applet } from 'shared/state';
import { builderSessionStorage } from 'shared/utils';

import { builderAppletTabs } from './BuilderApplet.const';
import { AppletSchema } from './BuilderApplet.schema';
import { getDefaultValues } from './BuilderApplet.utils';
import { AppletFormValues } from './BuilderApplet.types';

export const BuilderApplet = () => {
  const params = useParams();
  const hiddenHeader = !!params.activityId || !!params.activityFlowId;
  const dispatch = useAppDispatch();
  const { appletId } = useParams();
  const isNewApplet = useCheckIfNewApplet();
  const { result: appletData } = applet.useAppletData() ?? {};
  const loadingStatus = applet.useResponseStatus() ?? {};

  const { getFormValues } = useBuilderSessionStorageFormValues<AppletFormValues>(
    getDefaultValues(appletData),
  );

  const methods = useForm<AppletFormValues>({
    defaultValues: getFormValues(),
    resolver: yupResolver(AppletSchema()),
    mode: 'onChange',
  });

  useEffect(() => {
    if (loadingStatus === 'success' && !isNewApplet) methods.reset(getFormValues());
    if (isNewApplet) methods.reset(getDefaultValues());
  }, [loadingStatus, isNewApplet]);

  const { handleFormChange } = useBuilderSessionStorageFormChange<AppletFormValues>(
    methods.getValues,
  );

  methods.watch((_, { type, name }) => {
    if (type === 'change' || !!name) handleFormChange();
  });

  useEffect(() => {
    if (!appletId || isNewApplet) return;

    const { getApplet } = applet.thunk;
    dispatch(getApplet({ appletId }));
  }, [appletId]);

  useEffect(
    () => () => {
      builderSessionStorage.removeItem();
      dispatch(applet.actions.removeApplet());
    },
    [],
  );

  return (
    <FormProvider {...methods}>
      <StyledBody sx={{ position: 'relative' }}>
        <LinkedTabs hiddenHeader={hiddenHeader} tabs={builderAppletTabs} />
        <SaveAndPublish hasPrompt={methods.formState.isDirty} />
      </StyledBody>
    </FormProvider>
  );
};
