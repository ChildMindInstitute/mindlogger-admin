import { useCallback, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FormProvider, useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import debounce from 'lodash.debounce';

import { useAppDispatch } from 'redux/store';
import { SaveAndPublish } from 'modules/Builder/features';
import { LinkedTabs, Spinner } from 'shared/components';
import {
  useBuilderSessionStorageFormValues,
  useBuilderSessionStorageFormChange,
  useCheckIfNewApplet,
  useRemoveAppletData,
  usePermissions,
} from 'shared/hooks';
import { StyledBody } from 'shared/styles/styledComponents';
import { applet } from 'shared/state';
import { INPUT_DEBOUNCE_TIME } from 'shared/consts';
import { workspaces } from 'redux/modules';
import { AppletFormValues } from 'modules/Builder/types';
import { builderSessionStorage } from 'shared/utils';

import { AppletSchema } from './BuilderApplet.schema';
import {
  getDefaultValues,
  getAppletTabs,
  prepareActivitiesFromLibrary,
  prepareActivityFlowsFromLibrary,
} from './BuilderApplet.utils';

export const BuilderApplet = () => {
  const params = useParams();
  const location = useLocation();
  const hiddenHeader = !!params.activityId || !!params.activityFlowId;
  const dispatch = useAppDispatch();
  const { appletId } = useParams();
  const isNewApplet = useCheckIfNewApplet();
  const { result: appletData } = applet.useAppletData() ?? {};
  const { getAppletWithItems } = applet.thunk;
  const loadingStatus = applet.useResponseStatus();
  const appletResponseType = applet.useResponseTypePrefix();
  const isAppletLoaded =
    loadingStatus === 'success' &&
    appletResponseType === 'applet/getAppletWithItems' &&
    !isNewApplet;
  const { ownerId } = workspaces.useData() || {};
  const removeAppletData = useRemoveAppletData();
  const [isFromLibrary, setIsFromLibrary] = useState(false);
  const { data: dataFromLibrary } = location.state ?? {};
  const hasLibraryData = isFromLibrary && dataFromLibrary;

  const { getFormValues } = useBuilderSessionStorageFormValues<AppletFormValues>(
    getDefaultValues(appletData),
  );

  const { isForbidden, noPermissionsComponent } = usePermissions(() =>
    appletId && ownerId && !isNewApplet
      ? dispatch(getAppletWithItems({ ownerId, appletId }))
      : undefined,
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
    location.state?.isFromLibrary && setIsFromLibrary(true);
  }, [location.state?.isFromLibrary]);

  useEffect(() => {
    if (!isAppletLoaded) return;

    (async () => {
      await reset(getFormValues());

      if (!dataFromLibrary) return;

      const formValues = await getValues();
      const libraryConvertedValues = await getDefaultValues(dataFromLibrary);
      const newFormValues = {
        ...formValues,
        activities: prepareActivitiesFromLibrary([
          ...formValues.activities,
          ...libraryConvertedValues.activities,
        ]),
        activityFlows: prepareActivityFlowsFromLibrary([
          ...formValues.activityFlows,
          ...libraryConvertedValues.activityFlows,
        ]),
      };

      await reset(newFormValues);
    })();
  }, [isAppletLoaded]);

  useEffect(() => {
    if (hasLibraryData && isNewApplet) {
      (async () => {
        const libraryConvertedValues = await getDefaultValues(dataFromLibrary);
        const newFormValues = {
          ...libraryConvertedValues,
          activities: prepareActivitiesFromLibrary(libraryConvertedValues.activities),
          activityFlows: prepareActivityFlowsFromLibrary(libraryConvertedValues.activityFlows),
        };
        builderSessionStorage.setItem(newFormValues);
        await reset(newFormValues);
      })();
    }
  }, [hasLibraryData, isNewApplet]);

  useEffect(() => {
    if (!isNewApplet || isFromLibrary) return;

    removeAppletData();
    reset(getDefaultValues());
  }, [isNewApplet, isFromLibrary]);

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

  useEffect(() => removeAppletData, []);

  const { errors } = useFormState({
    control,
    name: ['displayName', 'activityFlows', 'activities'],
  });

  const tabErrors = {
    hasAboutAppletErrors: !!errors.displayName,
    hasAppletActivitiesErrors: !!errors.activities,
    hasAppletActivityFlowErrors: !!errors.activityFlows,
  };

  if (isForbidden) return noPermissionsComponent;

  return (
    <FormProvider {...methods}>
      <StyledBody sx={{ position: 'relative' }}>
        {loadingStatus === 'loading' && <Spinner />}
        <LinkedTabs hiddenHeader={hiddenHeader} tabs={getAppletTabs(tabErrors)} />
        <SaveAndPublish hasPrompt={isDirty || isFromLibrary} setIsFromLibrary={setIsFromLibrary} />
      </StyledBody>
    </FormProvider>
  );
};
