import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FormProvider, useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useAppDispatch } from 'redux/store';
import { SaveAndPublish } from 'modules/Builder/features';
import { LinkedTabs, Spinner } from 'shared/components';
import { useCheckIfNewApplet, useRemoveAppletData, usePermissions } from 'shared/hooks';
import { StyledBody } from 'shared/styles/styledComponents';
import { applet } from 'shared/state';
import { workspaces } from 'redux/modules';
import { AppletFormValues } from 'modules/Builder/types';

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
  const isLoading = (!isNewApplet && loadingStatus === 'idle') || loadingStatus === 'loading';

  const { isForbidden, noPermissionsComponent } = usePermissions(() =>
    appletId && ownerId && !isNewApplet
      ? dispatch(getAppletWithItems({ ownerId, appletId }))
      : undefined,
  );

  const methods = useForm<AppletFormValues>({
    defaultValues: getDefaultValues(appletData),
    resolver: yupResolver(AppletSchema()),
    mode: 'onChange',
  });
  const {
    reset,
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
      await reset(getDefaultValues(appletData));

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
        await reset(newFormValues);
      })();
    }
  }, [hasLibraryData, isNewApplet]);

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
        {isLoading && <Spinner />}
        <LinkedTabs hiddenHeader={hiddenHeader} tabs={getAppletTabs(tabErrors)} />
        <SaveAndPublish hasPrompt={isDirty || isFromLibrary} setIsFromLibrary={setIsFromLibrary} />
      </StyledBody>
    </FormProvider>
  );
};
