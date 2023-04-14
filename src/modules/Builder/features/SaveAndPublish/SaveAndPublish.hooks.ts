import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import { Update } from 'history';
import { useAppDispatch } from 'redux/store';
import { useCallbackPrompt, useCheckIfNewApplet, usePromptSetup } from 'shared/hooks';
import {
  APPLET_PAGE_REGEXP_STRING,
  builderSessionStorage,
  getBuilderAppletUrl,
  getDictionaryObject,
} from 'shared/utils';
import { applet, Activity, SingleApplet } from 'shared/state';
import { EnterAppletPasswordForm } from 'modules/Dashboard';
import { SaveAndPublishSteps } from 'modules/Builder/components/Popups/SaveAndPublishProcessPopup/SaveAndPublishProcessPopup.types';
import { isAppletRoute } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';

import { appletInfoMocked } from './mock';
import {
  removeItemExtraFields,
  removeAppletExtraFields,
  removeActivityExtraFields,
  usePasswordFromStorage,
} from './SaveAndPublish.utils';

export const getAppletInfoFromStorage = () => {
  const pathname = window.location.pathname;
  const match = pathname.match(APPLET_PAGE_REGEXP_STRING);
  if (!match) return {};

  return builderSessionStorage.getItem() ?? {};
};

export const useAppletData = () => {
  const isNewApplet = useCheckIfNewApplet();
  const { getValues } = useFormContext();
  const appletInfo = getValues() as SingleApplet;

  return (appletPassword?: EnterAppletPasswordForm['appletPassword']): SingleApplet => {
    const appletDescription = getDictionaryObject(appletInfo.description);
    const appletAbout = getDictionaryObject(appletInfo.about);

    const defaultAppletInfo = isNewApplet ? appletInfoMocked : {};

    return {
      ...defaultAppletInfo,
      ...appletInfo,
      activities: appletInfo?.activities.map((activity: Activity) => ({
        ...activity,
        key: activity.id || activity.key,
        description: getDictionaryObject(activity.description),
        items: activity.items?.map((item) => ({
          ...item,
          question: getDictionaryObject(item.question),
          ...removeItemExtraFields(item.responseType),
        })),
        ...removeActivityExtraFields(),
      })),
      password: appletPassword,
      description: appletDescription,
      about: appletAbout,
      themeId: null, // TODO: create real themeId
      activityFlows: appletInfo?.activityFlows.map(({ key, ...flow }) => ({
        ...flow,
        description: getDictionaryObject(flow.description),
        items: flow.items?.map(({ key, ...item }) => item),
      })),
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
    when: true,
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
      builderSessionStorage.removeItem();
      onConfirm();
    },
    cancelNavigation: onCancel,
    setPromptVisible,
  };
};

export const useSaveAndPublishSetup = (hasPrompt: boolean) => {
  const { trigger } = useFormContext();
  const getAppletData = useAppletData();
  const checkIfHasAtLeastOneActivity = useCheckIfHasAtLeastOneActivity();
  const checkIfHasAtLeastOneItem = useCheckIfHasAtLeastOneItem();
  const { createApplet, updateApplet } = applet.thunk;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { appletId } = useParams();
  const isNewApplet = useCheckIfNewApplet();
  const [isPasswordPopupOpened, setIsPasswordPopupOpened] = useState(false);
  const [isPublishProcessPopupOpened, setPublishProcessPopupOpened] = useState(false);
  const [publishProcessStep, setPublishProcessStep] = useState<SaveAndPublishSteps>();
  const responseStatus = applet.useResponseStatus();
  const { cancelNavigation, confirmNavigation, promptVisible, setPromptVisible } =
    usePrompt(hasPrompt);
  const shouldNavigateRef = useRef(false);
  const { getPassword, setPassword } = usePasswordFromStorage();

  useEffect(() => {
    responseStatus === 'loading' && setPublishProcessStep(SaveAndPublishSteps.BeingCreated);
    responseStatus === 'error' && setPublishProcessStep(SaveAndPublishSteps.Failed);
    responseStatus === 'success' && setPublishProcessStep(SaveAndPublishSteps.Success);
  }, [responseStatus]);

  const handleSaveChangesDoNotSaveSubmit = () => {
    setPromptVisible(false);
    confirmNavigation();
  };
  const handleSaveChangesSaveSubmit = () => {
    shouldNavigateRef.current = true;
    setPromptVisible(false);
    handleSaveAndPublishFirstClick();
  };
  const handleSaveAndPublishFirstClick = async () => {
    const hasNoActivities = !checkIfHasAtLeastOneActivity();
    const hasNoItems = !checkIfHasAtLeastOneItem();
    setPublishProcessPopupOpened(true);

    if (hasNoActivities) {
      setPublishProcessStep(SaveAndPublishSteps.AtLeastOneActivity);

      return;
    }
    if (hasNoItems) {
      setPublishProcessStep(SaveAndPublishSteps.AtLeastOneItem);

      return;
    }

    setPublishProcessPopupOpened(false);

    const isValid = await trigger();
    if (!isValid) {
      return;
    }
    await sendRequestWithPasswordCheck();
  };

  const handlePublishProcessOnClose = () => {
    setPublishProcessPopupOpened(false);
    setPublishProcessStep(undefined);
  };
  const sendRequestWithPasswordCheck = async () => {
    const password = getPassword();
    if (!password) {
      setIsPasswordPopupOpened(true);

      return;
    }
    await sendRequest(password);
  };

  const handleAppletPasswordSubmit = async ({ appletPassword }: EnterAppletPasswordForm) => {
    await sendRequest(appletPassword);
  };

  const sendRequest = async (appletPassword: EnterAppletPasswordForm['appletPassword']) => {
    setPublishProcessPopupOpened(true);
    const body = getAppletData(appletPassword);

    let result;
    if (isNewApplet || !appletId) {
      result = await dispatch(createApplet(body));
    }
    if (!isNewApplet && appletId) {
      result = await dispatch(updateApplet({ appletId, body }));
    }
    if (!result) return;

    if (updateApplet.fulfilled.match(result)) {
      const updatedAppletId = result.payload.data.result?.id;
      builderSessionStorage.removeItem();
      setPassword(updatedAppletId, appletPassword);
      if (shouldNavigateRef.current) {
        confirmNavigation();

        return;
      }

      appletId && navigate(getBuilderAppletUrl(appletId));
    }
    if (updateApplet.rejected.match(result)) {
      setPassword(appletId!, '');
    }

    if (createApplet.fulfilled.match(result)) {
      const createdAppletId = result.payload.data.result?.id;
      builderSessionStorage.removeItem();
      setPassword(createdAppletId, appletPassword);
      if (shouldNavigateRef.current) {
        confirmNavigation();

        return;
      }

      createdAppletId && navigate(getBuilderAppletUrl(createdAppletId));
    }
  };

  return {
    isNewApplet,
    isPasswordPopupOpened,
    isPublishProcessPopupOpened,
    publishProcessStep,
    promptVisible,
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
