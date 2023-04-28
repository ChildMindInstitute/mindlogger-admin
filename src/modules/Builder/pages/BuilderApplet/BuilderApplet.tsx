import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider, useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import debounce from 'lodash.debounce';

import { useAppDispatch } from 'redux/store';
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
import { INPUT_DEBOUNCE_TIME } from 'shared/consts';
import { workspaces } from 'redux/modules';

import { AppletSchema } from './BuilderApplet.schema';
import { getDefaultValues, getAppletTabs } from './BuilderApplet.utils';
import { AppletFormValues } from './BuilderApplet.types';

export const BuilderApplet = () => {
  const params = useParams();
  const hiddenHeader = !!params.activityId || !!params.activityFlowId;
  const dispatch = useAppDispatch();
  const { appletId } = useParams();
  const isNewApplet = useCheckIfNewApplet();
  const { result: appletData } = applet.useAppletData() ?? {};
  const loadingStatus = applet.useResponseStatus() ?? {};
  const { ownerId } = workspaces.useData() || {};

  const { getFormValues } = useBuilderSessionStorageFormValues<AppletFormValues>(
    getDefaultValues(appletData),
  );

  const methods = useForm<AppletFormValues>({
    defaultValues: getFormValues(),
    resolver: yupResolver(AppletSchema()),
    mode: 'onChange',
  });
  const {
    reset,
    watch,
    control,
    getValues,
    formState: { isDirty },
  } = methods;

  useEffect(() => {
    if (loadingStatus === 'success' && !isNewApplet) reset(getFormValues());
  }, [loadingStatus, isNewApplet]);

  useEffect(() => {
    if (isNewApplet) reset(getDefaultValues());
  }, [isNewApplet]);

  const { handleFormChange } = useBuilderSessionStorageFormChange<AppletFormValues>(getValues);

  const handleFormChangeDebounced = useCallback(debounce(handleFormChange, INPUT_DEBOUNCE_TIME), [
    handleFormChange,
  ]);

  useEffect(() => {
    const subscription = watch((_, { type, name }) => {
      if (type === 'change' || !!name) handleFormChangeDebounced();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!appletId || isNewApplet || !ownerId) return;

    const { getAppletWithItems } = applet.thunk;
    dispatch(getAppletWithItems({ ownerId, appletId }));
  }, [ownerId, appletId]);

  useEffect(
    () => () => {
      builderSessionStorage.removeItem();
      dispatch(applet.actions.removeApplet());
    },
    [],
  );

  const { errors } = useFormState({
    control,
    name: ['displayName', 'activityFlows', 'activities'],
  });

  const tabErrors = {
    hasAboutAppletErrors: !!errors.displayName,
    hasAppletActivitiesErrors: !!errors.activities,
    hasAppletActivityFlowErrors: !!errors.activityFlows,
  };

  return (
    <FormProvider {...methods}>
      <StyledBody sx={{ position: 'relative' }}>
        <LinkedTabs hiddenHeader={hiddenHeader} tabs={getAppletTabs(tabErrors)} />
        <SaveAndPublish hasPrompt={isDirty} />
      </StyledBody>
    </FormProvider>
  );
};
