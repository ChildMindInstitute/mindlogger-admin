import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm, useFormState } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { ObjectSchema } from 'yup';

import { SaveAndPublish } from 'modules/Builder/features/SaveAndPublish';
import { themes } from 'modules/Builder/state';
import { AppletFormValues } from 'modules/Builder/types';
import { workspaces } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { LinkedTabs, Spinner } from 'shared/components';
import { useCheckIfNewApplet, usePermissions, useRemoveAppletData } from 'shared/hooks';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { applet, forbiddenState } from 'shared/state';
import { StyledBody } from 'shared/styles/styledComponents';

import { themeParams } from './BuilderApplet.const';
import { AppletSchema } from './BuilderApplet.schema';
import {
  getAppletTabs,
  getDefaultThemeId,
  getDefaultValues,
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
  const redirectedFromBuilder = forbiddenState.useData()?.redirectedFromBuilder ?? {};
  const { result: appletDataResult } = applet.useAppletData() ?? {};
  const appletData = !isNewApplet ? appletDataResult : undefined;
  const { getAppletWithItems } = applet.thunk;
  const { result: themesList = [] } = themes.useThemesData() || {};
  const loadingStatus = applet.useResponseStatus();
  const themesLoadingStatus = themes.useThemesStatus();
  const appletResponseType = applet.useResponseTypePrefix();
  const isAppletLoaded =
    loadingStatus === 'success' &&
    appletResponseType === 'applet/getAppletWithItems' &&
    !isNewApplet;
  const { ownerId } = workspaces.useData() || {};
  const removeAppletData = useRemoveAppletData();
  const [isAppletInitialized, setAppletInitialized] = useState(false);
  const { data: dataFromLibrary, isFromLibrary } = location.state ?? {};
  const hasLibraryData = isFromLibrary && !!dataFromLibrary;

  const isLoading =
    (!isNewApplet && loadingStatus === 'idle') ||
    loadingStatus === 'loading' ||
    themesLoadingStatus === 'loading';
  const defaultThemeId = getDefaultThemeId(themesList);

  const { isForbidden, noPermissionsComponent } = usePermissions(() =>
    appletId && ownerId && !isNewApplet && !redirectedFromBuilder
      ? dispatch(getAppletWithItems({ ownerId, appletId }))
      : undefined,
  );
  const defaultValues = useMemo(
    () => getDefaultValues(appletData, defaultThemeId),
    [appletData, defaultThemeId],
  );

  const { featureFlags } = useFeatureFlags();

  const methods = useForm<AppletFormValues>({
    defaultValues,
    resolver: yupResolver(AppletSchema(featureFlags) as ObjectSchema<AppletFormValues>),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });
  const { reset, control, setValue, getValues } = methods;

  useEffect(() => {
    if (!isAppletLoaded) return;

    (async () => {
      await reset(getDefaultValues(appletData, defaultThemeId), {
        keepDirty: false,
      });

      if (!hasLibraryData) return;

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

      await reset(newFormValues, { keepDefaultValues: true });
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
        await reset(newFormValues, { keepDefaultValues: true });
      })();
    }
  }, [hasLibraryData, isNewApplet]);

  useEffect(() => {
    if (!isNewApplet || !defaultThemeId) return;
    setValue('themeId', defaultThemeId);
  }, [defaultThemeId, isNewApplet]);

  useEffect(() => {
    dispatch(themes.actions.resetThemes());
    dispatch(themes.thunk.getThemes({ ...themeParams, page: 1 }));

    return removeAppletData;
  }, []);

  useEffect(() => {
    if (isAppletInitialized) return;

    setAppletInitialized(isAppletLoaded || isNewApplet);
  }, [isAppletLoaded, isNewApplet]);

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
        {isAppletInitialized ? (
          <>
            {isLoading && <Spinner />}
            <LinkedTabs hiddenHeader={hiddenHeader} tabs={getAppletTabs(tabErrors)} isBuilder />
            <SaveAndPublish />
          </>
        ) : (
          <Spinner />
        )}
      </StyledBody>
    </FormProvider>
  );
};
