import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ValidationError } from 'yup';
import { Update } from 'history';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from 'redux/store';
import {
  useCallbackPrompt,
  useCheckIfNewApplet,
  useLogout,
  usePromptSetup,
  useRemoveAppletData,
} from 'shared/hooks';
import {
  Encryption,
  getDictionaryObject,
  getEncryptionToServer,
  getSanitizedContent,
  getUpdatedAppletUrl,
  Mixpanel,
  SettingParam,
} from 'shared/utils';
import { Activity, ActivityFlow, applet, SingleApplet } from 'shared/state';
import { getAppletUniqueNameApi } from 'shared/api';
import { AppletThunkTypePrefix } from 'shared/state/Applet/Applet.thunk';
import { auth, workspaces } from 'redux/modules';
import { useAppletPrivateKeySetter, useCustomFormContext } from 'modules/Builder/hooks';
import { SaveAndPublishSteps } from 'modules/Builder/components/Popups/SaveAndPublishProcessPopup/SaveAndPublishProcessPopup.types';
import { isAppletRoute } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { AppletSchema } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.schema';
import { AppletFormValues } from 'modules/Builder/types';
import { reportConfig } from 'modules/Builder/state';
import {
  FlowReportFieldsPrepareType,
  getEntityReportFields,
} from 'modules/Builder/utils/getEntityReportFields';
import { banners } from 'shared/state/Banners';
import { ErrorResponseType, LocationState, LocationStateKeys } from 'shared/types';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import {
  getActivityItems,
  getCurrentEntitiesIds,
  getScoresAndReports,
  remapSubscaleSettings,
  removeActivityExtraFields,
  removeActivityFlowExtraFields,
  removeActivityFlowItemExtraFields,
  removeAppletExtraFields,
} from './SaveAndPublish.utils';
import { SaveAndPublishSetup } from './SaveAndPublish.types';

export const useAppletDataFromForm = () => {
  const { getValues } = useCustomFormContext() || {};
  const isNewApplet = useCheckIfNewApplet();

  return (encryption?: Encryption): SingleApplet | undefined => {
    const appletInfo = getValues?.() as AppletFormValues;

    if (!appletInfo) return;

    const appletDescription = getDictionaryObject(appletInfo.description);
    const appletAbout = getDictionaryObject(appletInfo.about);

    return {
      ...appletInfo,
      displayName: getSanitizedContent(appletInfo.displayName, true, true),
      activities: appletInfo?.activities.map(
        (activity) =>
          ({
            ...activity,
            key: activity.id || activity.key,
            description: getDictionaryObject(activity.description),
            items: getActivityItems(activity),
            subscaleSetting: remapSubscaleSettings(activity),
            scoresAndReports: getScoresAndReports(activity),
            ...getEntityReportFields({
              reportItem: activity.reportIncludedItemName,
              activityItems: activity.items,
              type: FlowReportFieldsPrepareType.KeyToName,
            }),
            ...removeActivityExtraFields(),
          }) as Activity,
      ),
      encryption,
      description: appletDescription,
      about: appletAbout,
      themeId: appletInfo.themeId || null,
      activityFlows: appletInfo?.activityFlows.map(
        ({ key: _key, ...flow }) =>
          ({
            ...flow,
            description: getDictionaryObject(flow.description),
            items: flow.items?.map(({ key: _key, ...item }) => ({
              ...item,
              ...removeActivityFlowItemExtraFields(),
            })),
            ...getEntityReportFields({
              reportActivity: flow.reportIncludedActivityName ?? '',
              reportItem: flow.reportIncludedItemName ?? '',
              activities: appletInfo.activities,
              type: FlowReportFieldsPrepareType.KeyToName,
            }),
            ...removeActivityFlowExtraFields(),
          }) as ActivityFlow,
      ),
      // TODO: Once the backend (the necessary endpoints to enable integration) is ready,
      // make sure that the integrations property works correctly
      ...removeAppletExtraFields(isNewApplet),
    };
  };
};

export const useCheckIfHasAtLeastOneActivity = () => {
  const getAppletData = useAppletDataFromForm();

  return () => {
    const body = getAppletData();

    return Boolean(body?.activities?.length);
  };
};

export const useCheckIfHasAtLeastOneItem = () => {
  const getAppletData = useAppletDataFromForm();

  return () => {
    const body = getAppletData();

    return (body?.activities ?? []).every((activity) => Boolean(activity.items?.length));
  };
};

export const useCheckIfHasEmptyRequiredFields = () => {
  const { getValues } = useCustomFormContext();
  const { featureFlags } = useFeatureFlags();
  const appletSchema = AppletSchema(featureFlags.enableItemFlowExtendedItems);

  return async () => {
    const body = getValues();

    try {
      await appletSchema.validate(body, { abortEarly: false });
    } catch (e) {
      const { errors } = e as ValidationError;

      return errors && errors.some((errorMessage: string) => errorMessage.includes('required'));
    }
  };
};

export const useCheckIfHasErrorsInFields = () => {
  const { getValues } = useCustomFormContext();
  const { featureFlags } = useFeatureFlags();
  const appletSchema = AppletSchema(featureFlags.enableItemFlowExtendedItems);

  return async () => {
    const body = getValues();

    try {
      await appletSchema.validate(body, { abortEarly: false });
    } catch (e) {
      const { errors } = e as ValidationError;

      return errors?.length;
    }
  };
};

export const usePrompt = (isFormChanged: boolean) => {
  const {
    location,
    promptVisible,
    setPromptVisible,
    lastLocation,
    setLastLocation,
    confirmedNavigation,
    setConfirmedNavigation,
  } = usePromptSetup();
  const isLogoutInProgress = auth.useLogoutInProgress();
  const dispatch = useAppDispatch();
  const onLogout = useLogout();

  useEffect(() => {
    if (!isLogoutInProgress) return;

    if (isFormChanged) {
      setPromptVisible(true);
    } else {
      dispatch(auth.actions.endLogout());
      onLogout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogoutInProgress, isFormChanged]);

  const handleBlockedNavigation = useCallback(
    (nextLocation: Update) => {
      const nextPathname = nextLocation.location.pathname;

      const shouldSkip =
        !isFormChanged ||
        isAppletRoute(nextPathname) ||
        (nextLocation.location.state as LocationState)?.[
          LocationStateKeys.ShouldNavigateWithoutPrompt
        ];

      if (!confirmedNavigation && !shouldSkip) {
        setPromptVisible(true);
        setLastLocation(nextLocation);

        return false;
      }

      setLastLocation({
        ...nextLocation,
        location: {
          ...nextLocation.location,
          state: {
            ...(nextLocation.location.state ?? {}),
            [LocationStateKeys.ShouldNavigateWithoutPrompt]: undefined,
          },
        },
      });
      setConfirmedNavigation(true);

      return true;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [confirmedNavigation, location, isFormChanged],
  );

  const { cancelNavigation: onCancel, confirmNavigation: onConfirm } = useCallbackPrompt({
    when: !isLogoutInProgress,
    handleBlockedNavigation,
    lastLocation,
    setLastLocation,
    setPromptVisible,
    confirmedNavigation,
    setConfirmedNavigation,
  });

  return {
    promptVisible,
    confirmNavigation: () => {
      onConfirm();
    },
    cancelNavigation: onCancel,
    setPromptVisible,
    isLogoutInProgress,
  };
};

export const useUpdatedAppletNavigate = () => {
  const { ownerId = '' } = workspaces.useData() ?? {};
  const { activityId, activityFlowId, itemId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { getValues, reset } = useCustomFormContext();

  const { getAppletWithItems } = applet.thunk;

  return async (appletId: string) => {
    const oldApplet = getValues();
    const newAppletResult = await dispatch(getAppletWithItems({ ownerId, appletId }));

    if (getAppletWithItems.fulfilled.match(newAppletResult)) {
      const newApplet = newAppletResult.payload.data.result;
      const { newActivityOrFlowId, newItemId } = getCurrentEntitiesIds(oldApplet, newApplet, {
        isActivity: !!activityId,
        activityOrFlowId: activityId ?? activityFlowId,
        itemId,
      });
      const url = getUpdatedAppletUrl(appletId, newActivityOrFlowId, newItemId, location.pathname);
      await navigate(url);
      reset(undefined, { keepDirty: false });
    }
  };
};

export const useSaveAndPublishSetup = (): SaveAndPublishSetup => {
  const { t } = useTranslation('app');
  const {
    trigger,
    formState: { dirtyFields, isDirty },
  } = useCustomFormContext();
  const { pathname } = useLocation();
  const getAppletData = useAppletDataFromForm();
  const checkIfHasAtLeastOneActivity = useCheckIfHasAtLeastOneActivity();
  const checkIfHasAtLeastOneItem = useCheckIfHasAtLeastOneItem();
  const checkIfHasEmptyRequiredFields = useCheckIfHasEmptyRequiredFields();
  const checkIfHasErrorsInFields = useCheckIfHasErrorsInFields();
  const navigateToApplet = useUpdatedAppletNavigate();
  const { createApplet, updateApplet } = applet.thunk;
  const dispatch = useAppDispatch();
  const { appletId } = useParams();
  const isNewApplet = useCheckIfNewApplet();
  const [isPasswordPopupOpened, setIsPasswordPopupOpened] = useState(false);
  const [isPublishProcessPopupOpened, setPublishProcessPopupOpened] = useState(false);
  const [publishProcessStep, setPublishProcessStep] = useState<SaveAndPublishSteps>();
  const responseStatus = applet.useResponseStatus();
  const responseError = applet.useResponseError() ?? [];
  const responseTypePrefix = applet.useResponseTypePrefix();
  const isResponseStatusError = responseStatus === 'error';
  const hasAccessDeniedError =
    Array.isArray(responseError) &&
    responseError.some((error) => error.type === ErrorResponseType.AccessDenied);
  const {
    cancelNavigation: onCancelNavigation,
    confirmNavigation,
    promptVisible,
    setPromptVisible,
    isLogoutInProgress,
  } = usePrompt(isDirty && !hasAccessDeniedError);
  const shouldNavigateRef = useRef(false);
  const appletUniqueNameRef = useRef<string | null>(null);
  const { ownerId } = workspaces.useData() || {};
  const checkIfAppletBeingCreatedOrUpdatedRef = useRef(false);
  const { result: appletData } = applet.useAppletData() ?? {};
  const appletEncryption = appletData?.encryption;
  const setAppletPrivateKey = useAppletPrivateKeySetter();
  const removeAppletData = useRemoveAppletData();
  const handleLogout = useLogout();
  const { hasChanges: hasReportConfigChanges } = reportConfig.useReportConfigChanges() || {};
  const isDisplayNameDirty = dirtyFields?.displayName;

  useEffect(() => {
    const isUpdateOrCreate =
      responseTypePrefix === AppletThunkTypePrefix.Create ||
      responseTypePrefix === AppletThunkTypePrefix.Update;

    if (!isUpdateOrCreate) return;

    if (responseStatus === 'loading' && checkIfAppletBeingCreatedOrUpdatedRef.current) {
      setPublishProcessStep(SaveAndPublishSteps.BeingCreated);
    }
    if (isResponseStatusError) {
      if (hasAccessDeniedError) return;

      setPublishProcessStep(SaveAndPublishSteps.Failed);
    }
  }, [responseStatus, responseTypePrefix, isResponseStatusError, hasAccessDeniedError]);

  const handleSaveChangesDoNotSaveSubmit = async () => {
    setPromptVisible(false);
    removeAppletData();
    confirmNavigation();

    if (isLogoutInProgress) {
      await handleLogout();
      dispatch(auth.actions.endLogout());
    }
  };

  const cancelNavigation = () => {
    if (isLogoutInProgress) {
      dispatch(auth.actions.endLogout());
    }

    onCancelNavigation();
  };

  const handleSaveChangesSaveSubmit = async () => {
    shouldNavigateRef.current = true;
    setPromptVisible(false);
    await handleSaveAndPublishFirstClick();
    Mixpanel.track('Applet Save click', {
      'Applet ID': appletId,
    });

    if (isLogoutInProgress) {
      await handleLogout();
      dispatch(auth.actions.endLogout());
    }
  };

  const handleSaveAndPublishFirstClick = async () => {
    const isValid = await trigger();
    const hasNoActivities = !checkIfHasAtLeastOneActivity();
    const hasNoItems = !checkIfHasAtLeastOneItem();
    const hasEmptyRequiredFields = await checkIfHasEmptyRequiredFields();
    const hasErrorsInFields = await checkIfHasErrorsInFields();
    setPublishProcessPopupOpened(true);

    if (pathname.includes(SettingParam.ReportConfiguration) && hasReportConfigChanges) {
      setPublishProcessStep(SaveAndPublishSteps.ReportConfigSave);

      return;
    }

    if (hasNoActivities) {
      setPublishProcessStep(SaveAndPublishSteps.AtLeastOneActivity);

      return;
    }
    if (hasNoItems) {
      setPublishProcessStep(SaveAndPublishSteps.AtLeastOneItem);

      return;
    }

    if (!isValid) {
      if (hasEmptyRequiredFields) {
        setPublishProcessStep(SaveAndPublishSteps.EmptyRequiredFields);

        return;
      }

      if (hasErrorsInFields) {
        setPublishProcessStep(SaveAndPublishSteps.ErrorsInFields);

        return;
      }

      return;
    }

    setPublishProcessPopupOpened(false);

    Mixpanel.track('Applet Save click', {
      'Applet ID': appletId,
    });

    await sendRequestWithPasswordCheck();
  };

  const handlePublishProcessOnClose = () => {
    setPublishProcessPopupOpened(false);
    setPublishProcessStep(undefined);
  };

  const sendRequestWithPasswordCheck = async () => {
    if (isNewApplet) {
      setIsPasswordPopupOpened(true);

      return;
    }

    if (!isDirty) {
      dispatch(banners.actions.addBanner({ key: 'AppletWithoutChangesBanner' }));

      return;
    }

    await sendRequest();
  };

  const handleAppletPasswordSubmit = async (password?: string) => {
    await sendRequest(password);
  };

  const showSuccessBanner = (isUpdate?: boolean) => {
    // If there is any visible banner warning the user they haven't made changes,
    // remove it before showing the success banner.
    dispatch(
      banners.actions.removeBanner({
        key: 'AppletWithoutChangesBanner',
      }),
    );

    dispatch(
      banners.actions.addBanner({
        key: 'SaveSuccessBanner',
        bannerProps: {
          children: t(isUpdate ? 'appletUpdated' : 'appletSavedAndPublished', {
            name: getAppletData()?.displayName,
          }),
          'data-testid': 'dashboard-applets-save-success-banner',
        },
      }),
    );

    handlePublishProcessOnClose();
  };

  const sendRequest = async (password?: string) => {
    let encryptionData: Encryption | undefined;

    if (password && ownerId) {
      encryptionData = await getEncryptionToServer(password, ownerId);
    } else {
      encryptionData = appletEncryption;
    }

    setPublishProcessPopupOpened(true);
    const appletData = getAppletData(encryptionData);

    if (!appletData) return;

    let result;
    try {
      const uniqueNameResult =
        isDisplayNameDirty && (await getAppletUniqueNameApi({ name: appletData.displayName }));
      appletUniqueNameRef.current = uniqueNameResult?.data?.result?.name || null;
    } catch (error) {
      appletUniqueNameRef.current = null;
      console.warn(error);
    } finally {
      const body = {
        ...appletData,
        displayName: appletUniqueNameRef.current || appletData.displayName,
      };
      checkIfAppletBeingCreatedOrUpdatedRef.current = true;
      if ((isNewApplet || !appletId) && ownerId) {
        result = await dispatch(createApplet({ ownerId, body }));
      }
      if (!isNewApplet && appletId) {
        result = await dispatch(updateApplet({ appletId, body }));
      }
      checkIfAppletBeingCreatedOrUpdatedRef.current = false;
    }

    if (!result) return;

    if (updateApplet.fulfilled.match(result)) {
      Mixpanel.track('Applet edit successful', {
        'Applet ID': appletId,
      });

      showSuccessBanner(true);

      if (shouldNavigateRef.current) {
        confirmNavigation();

        return;
      }

      if (appletId && ownerId) {
        navigateToApplet(appletId);
      }
    }

    if (createApplet.fulfilled.match(result)) {
      Mixpanel.track('Applet Created Successfully', {
        'Applet ID': appletId,
      });

      showSuccessBanner();

      const createdAppletId = result.payload.data.result?.id;

      if (encryptionData && password && createdAppletId) {
        await setAppletPrivateKey({
          appletPassword: password,
          encryption: encryptionData,
          appletId: createdAppletId,
        });
      }

      if (shouldNavigateRef.current) {
        confirmNavigation();

        return;
      }

      if (createdAppletId && ownerId) {
        navigateToApplet(createdAppletId);
      }
    }
  };

  return {
    isPasswordPopupOpened,
    isPublishProcessPopupOpened,
    publishProcessStep,
    promptVisible,
    appletEncryption,
    setIsPasswordPopupOpened,
    handleSaveAndPublishFirstClick,
    handleAppletPasswordSubmit,
    handlePublishProcessOnClose,
    handlePublishProcessOnRetry: sendRequestWithPasswordCheck,
    handleSaveChangesDoNotSaveSubmit,
    handleSaveChangesSaveSubmit,
    cancelNavigation,
  };
};
