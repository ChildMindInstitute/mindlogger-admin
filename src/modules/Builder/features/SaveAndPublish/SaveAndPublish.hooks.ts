import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { ValidationError } from 'yup';

import { Update } from 'history';
import { useAppDispatch } from 'redux/store';
import {
  useCallbackPrompt,
  useCheckIfNewApplet,
  usePromptSetup,
  useRemoveAppletData,
  useLogout,
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
import { applet, Activity, SingleApplet, ActivityFlow } from 'shared/state';
import { auth, workspaces } from 'redux/modules';
import { useAppletPrivateKeySetter } from 'modules/Builder/hooks';
import { SaveAndPublishSteps } from 'modules/Builder/components/Popups/SaveAndPublishProcessPopup/SaveAndPublishProcessPopup.types';
import { isAppletRoute } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { AppletSchema } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.schema';
import { AppletFormValues } from 'modules/Builder/types';
import { reportConfig } from 'modules/Builder/state';

import {
  removeAppletExtraFields,
  removeActivityExtraFields,
  removeActivityFlowExtraFields,
  removeActivityFlowItemExtraFields,
  remapSubscaleSettings,
  getActivityItems,
  getScoresAndReports,
  getCurrentEntityId,
} from './SaveAndPublish.utils';

export const useAppletData = () => {
  const { getValues } = useFormContext();

  return (encryption?: Encryption): SingleApplet => {
    const appletInfo = getValues() as AppletFormValues;

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
            ...removeActivityExtraFields(),
          } as Activity),
      ),
      encryption,
      description: appletDescription,
      about: appletAbout,
      themeId: null, // TODO: create real themeId
      activityFlows: appletInfo?.activityFlows.map(
        ({ key, ...flow }) =>
          ({
            ...flow,
            description: getDictionaryObject(flow.description),
            items: flow.items?.map(({ key, ...item }) => ({
              ...item,
              ...removeActivityFlowItemExtraFields(),
            })),
            ...removeActivityFlowExtraFields(),
          } as ActivityFlow),
      ),
      ...removeAppletExtraFields(),
    };
  };
};

export const useCheckIfHasAtLeastOneActivity = () => {
  const getAppletData = useAppletData();

  return () => {
    const body = getAppletData();

    return Boolean(body.activities?.length);
  };
};

export const useCheckIfHasAtLeastOneItem = () => {
  const getAppletData = useAppletData();

  return () => {
    const body = getAppletData();

    return (body.activities ?? []).every((activity) => Boolean(activity.items?.length));
  };
};

export const useCheckIfHasEmptyRequiredFields = () => {
  const { getValues } = useFormContext();
  const appletSchema = AppletSchema();

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
  const { getValues } = useFormContext();
  const appletSchema = AppletSchema();

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
  }, [isLogoutInProgress, isFormChanged]);

  const handleBlockedNavigation = useCallback(
    (nextLocation: Update) => {
      const nextPathname = nextLocation.location.pathname;

      const shouldSkip = !isFormChanged || isAppletRoute(nextPathname);

      if (!confirmedNavigation && !shouldSkip) {
        setPromptVisible(true);
        setLastLocation(nextLocation);

        return false;
      }

      setLastLocation(nextLocation);
      setConfirmedNavigation(true);

      return true;
    },
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
  const { activityId, activityFlowId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { getValues, reset } = useFormContext();

  const { getAppletWithItems } = applet.thunk;

  return async (appletId: string) => {
    const oldApplet = getValues();
    const newAppletResult = await dispatch(getAppletWithItems({ ownerId, appletId }));

    if (getAppletWithItems.fulfilled.match(newAppletResult)) {
      const newApplet = newAppletResult.payload.data.result;
      const newEntityId = getCurrentEntityId(oldApplet, newApplet, {
        isActivity: !!activityId,
        id: activityId ?? activityFlowId,
      });
      const url = getUpdatedAppletUrl(appletId, newEntityId, location.pathname);
      await navigate(url);
      reset(undefined, { keepDirty: false });
    }
  };
};

export const useSaveAndPublishSetup = (
  hasPrompt: boolean,
  setIsFromLibrary?: Dispatch<SetStateAction<boolean>>,
) => {
  const { trigger } = useFormContext();
  const { pathname } = useLocation();
  const getAppletData = useAppletData();
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
  const {
    cancelNavigation: onCancelNavigation,
    confirmNavigation,
    promptVisible,
    setPromptVisible,
    isLogoutInProgress,
  } = usePrompt(hasPrompt);
  const shouldNavigateRef = useRef(false);
  const { ownerId } = workspaces.useData() || {};
  const checkIfAppletBeingCreatedOrUpdatedRef = useRef(false);
  const { result: appletData } = applet.useAppletData() ?? {};
  const appletEncryption = appletData?.encryption;
  const setAppletPrivateKey = useAppletPrivateKeySetter();
  const removeAppletData = useRemoveAppletData();
  const handleLogout = useLogout();
  const { hasChanges: hasReportConfigChanges } = reportConfig.useReportConfigChanges() || {};

  useEffect(() => {
    if (responseStatus === 'loading' && checkIfAppletBeingCreatedOrUpdatedRef.current) {
      setPublishProcessStep(SaveAndPublishSteps.BeingCreated);
    }
    responseStatus === 'error' && setPublishProcessStep(SaveAndPublishSteps.Failed);
    responseStatus === 'success' && setPublishProcessStep(SaveAndPublishSteps.Success);
  }, [responseStatus]);

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

  const handleSaveChangesSaveSubmit = () => {
    shouldNavigateRef.current = true;
    setPromptVisible(false);
    handleSaveAndPublishFirstClick();
    Mixpanel.track('Applet Save click');

    if (isLogoutInProgress) {
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
    await sendRequest();
  };

  const handleAppletPasswordSubmit = async (password?: string) => {
    await sendRequest(password);
  };

  const sendRequest = async (password?: string) => {
    const encryptionData = password ? getEncryptionToServer(password, ownerId!) : appletEncryption;
    setPublishProcessPopupOpened(true);
    const body = getAppletData(encryptionData);

    let result;
    checkIfAppletBeingCreatedOrUpdatedRef.current = true;
    if ((isNewApplet || !appletId) && ownerId) {
      result = await dispatch(createApplet({ ownerId, body }));
    }
    if (!isNewApplet && appletId) {
      result = await dispatch(updateApplet({ appletId, body }));
    }
    checkIfAppletBeingCreatedOrUpdatedRef.current = false;
    if (!result) return;

    if (updateApplet.fulfilled.match(result)) {
      setIsFromLibrary?.(false);
      if (shouldNavigateRef.current) {
        confirmNavigation();

        return;
      }

      if (appletId && ownerId) {
        navigateToApplet(appletId);
      }
    }

    if (createApplet.fulfilled.match(result)) {
      Mixpanel.track('Applet Created Successfully');

      const createdAppletId = result.payload.data.result?.id;
      setIsFromLibrary?.(false);

      if (encryptionData && password && createdAppletId) {
        setAppletPrivateKey({
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
