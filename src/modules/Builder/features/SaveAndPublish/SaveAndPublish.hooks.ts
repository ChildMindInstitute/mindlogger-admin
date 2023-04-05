import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'redux/store';
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Update } from 'history';

import { useCallbackPrompt, useCheckIfNewApplet, usePromptSetup } from 'shared/hooks';
import {
  APPLET_PAGE_REGEXP_STRING,
  builderSessionStorage,
  getBuilderAppletUrl,
} from 'shared/utils';
import { applet, SingleApplet } from 'shared/state';
import { EnterAppletPasswordForm } from 'modules/Dashboard';
import { SavaAndPublishStep } from 'modules/Builder/components/Popups/SaveAndPublishProcessPopup/SaveAndPublishProcessPopup.types';
import { isAppletRoute } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';

import { appletActivitiesMocked, appletActivityFlowsMocked, appletDataMocked } from './mock';
import { getAppletDataForApi } from './SaveAndPublish.utils';

export const getAppletInfoFromStorage = () => {
  const pathname = window.location.pathname;
  const match = pathname.match(APPLET_PAGE_REGEXP_STRING);
  if (!match) return {};

  return builderSessionStorage.getItem() ?? {};
};

export const useAppletData = () => {
  const isNewApplet = useCheckIfNewApplet();
  const { result: appletData } = applet.useAppletData() ?? {};
  const {
    i18n: { language },
  } = useTranslation('app');

  return (appletPassword?: EnterAppletPasswordForm['appletPassword']): SingleApplet => {
    const appletInfo = getAppletInfoFromStorage();
    const appletInfoForApi = getAppletDataForApi(appletInfo);

    if (isNewApplet) {
      return {
        ...appletDataMocked,
        ...appletInfoForApi,
        password: appletPassword,
        description: {
          [language]: appletInfo.description,
        },
        about: {
          [language]: appletInfo.about,
        },
        themeId: null, // TODO: create real themeId
        // eslint-disable-next-line
        // @ts-ignore
        activities: appletActivitiesMocked, // TODO: add real activities
        // eslint-disable-next-line
        // @ts-ignore
        activityFlows: appletActivityFlowsMocked, // TODO: add real activityFlows
      };
    }

    const appletDataForApi = getAppletDataForApi(appletData!);

    return {
      ...appletDataForApi,
      ...appletInfoForApi,
      password: appletPassword,
      description: {
        ...appletDataForApi.description,
        [language]: appletInfo?.description ?? appletDataForApi.description[language],
      },
      about: {
        ...appletDataForApi.about,
        [language]: appletInfo?.about ?? appletDataForApi.about[language],
      },
      themeId: null, // TODO: create real themeId
      // eslint-disable-next-line
      // @ts-ignore
      activities: appletActivitiesMocked, // TODO: api has error details: items-missed; order-permitted, description has wrong type
      // eslint-disable-next-line
      // @ts-ignore
      activityFlows: appletActivityFlowsMocked, // TODO: api has error details: items-missed; activitiesIds/order-permitted
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

export const useSavaAndPublishSetup = (hasPrompt: boolean) => {
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
  const [publishProcessStep, setPublishProcessStep] = useState<SavaAndPublishStep>();
  const [appletPassword, setAppletPassword] = useState('');
  const responseStatus = applet.useResponseStatus();
  const { cancelNavigation, confirmNavigation, promptVisible, setPromptVisible } =
    usePrompt(hasPrompt);
  const shouldNavigateRef = useRef(false);

  useEffect(() => {
    responseStatus === 'loading' && setPublishProcessStep(SavaAndPublishStep.BeingCreated);
    responseStatus === 'error' && setPublishProcessStep(SavaAndPublishStep.Failed);
    responseStatus === 'success' && setPublishProcessStep(SavaAndPublishStep.Success);
  }, [responseStatus]);

  const handleSaveChangesSubmit = () => {
    shouldNavigateRef.current = true;
    setPromptVisible(false);
    handleSaveAndPublishFirstClick();
  };
  const handleSaveAndPublishFirstClick = () => {
    const hasNoActivities = !checkIfHasAtLeastOneActivity();
    const hasNoItems = !checkIfHasAtLeastOneItem();
    setPublishProcessPopupOpened(true);

    if (hasNoActivities) {
      setPublishProcessStep(SavaAndPublishStep.AtLeast1Activity);

      return;
    }
    if (hasNoItems) {
      setPublishProcessStep(SavaAndPublishStep.AtLeast1Item);

      return;
    }

    setPublishProcessPopupOpened(false);
    setIsPasswordPopupOpened(true);
  };

  const handlePublishProcessOnClose = () => {
    setPublishProcessPopupOpened(false);
    setPublishProcessStep(undefined);
  };
  const handlePublishProcessOnRetry = async () => {
    await sendRequest(appletPassword);
  };

  const handleAppletPasswordSubmit = async ({ appletPassword }: EnterAppletPasswordForm) => {
    setAppletPassword(appletPassword);
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
      builderSessionStorage.removeItem();
      setAppletPassword('');
      if (shouldNavigateRef.current) {
        confirmNavigation();
      }
    }

    if (!isNewApplet) return;

    if (createApplet.fulfilled.match(result)) {
      builderSessionStorage.removeItem();
      setAppletPassword('');
      if (shouldNavigateRef.current) {
        confirmNavigation();

        return;
      }

      const createdAppletId = result.payload.data.result?.id;
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
    handlePublishProcessOnRetry,
    handleSaveChangesSubmit,
    cancelNavigation,
  };
};
