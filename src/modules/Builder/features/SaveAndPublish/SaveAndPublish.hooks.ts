import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { ValidationError } from 'yup';

import { Update } from 'history';
import { useAppDispatch } from 'redux/store';
import {
  useCallbackPrompt,
  useCheckIfNewApplet,
  usePromptSetup,
  useEncryptionCheckFromStorage,
} from 'shared/hooks';
import {
  APPLET_PAGE_REGEXP_STRING,
  builderSessionStorage,
  Encryption,
  getBuilderAppletUrl,
  getDictionaryObject,
} from 'shared/utils';
import { applet, Activity, SingleApplet } from 'shared/state';
import { workspaces } from 'redux/modules';
import { SaveAndPublishSteps } from 'modules/Builder/components/Popups/SaveAndPublishProcessPopup/SaveAndPublishProcessPopup.types';
import { isAppletRoute } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { AppletSchema } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.schema';

import { appletInfoMocked } from './mock';
import {
  removeItemExtraFields,
  removeAppletExtraFields,
  removeActivityExtraFields,
  mapItemResponseValues,
  getItemConditionalLogic,
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

  return (encryption?: Encryption): SingleApplet => {
    const appletInfo = getValues() as SingleApplet;

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
        items: activity.items?.map(({ id, ...item }) => ({
          ...item,
          ...(id && { id }),
          question: getDictionaryObject(item.question),
          responseValues: mapItemResponseValues(item.responseType, item.responseValues),
          conditionalLogic: getItemConditionalLogic(
            { ...item, id },
            activity.items,
            activity.conditionalLogic,
          ),
          ...removeItemExtraFields(),
        })),
        ...removeActivityExtraFields(),
      })),
      encryption,
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
  const checkIfHasEmptyRequiredFields = useCheckIfHasEmptyRequiredFields();
  const checkIfHasErrorsInFields = useCheckIfHasErrorsInFields();
  const { createApplet, updateApplet, getAppletWithItems } = applet.thunk;
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
  const { getEncryptionCheck } = useEncryptionCheckFromStorage();
  const { ownerId } = workspaces.useData() || {};
  const checkIfAppletBeingCreatedOrUpdatedRef = useRef(false);
  const { result: appletData } = applet.useAppletData() ?? {};
  const appletEncryption = appletData?.encryption;

  useEffect(() => {
    if (responseStatus === 'loading' && checkIfAppletBeingCreatedOrUpdatedRef.current) {
      setPublishProcessStep(SaveAndPublishSteps.BeingCreated);
    }
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
    const isValid = await trigger();
    const hasNoActivities = !checkIfHasAtLeastOneActivity();
    const hasNoItems = !checkIfHasAtLeastOneItem();
    const hasEmptyRequiredFields = await checkIfHasEmptyRequiredFields();
    const hasErrorsInFields = await checkIfHasErrorsInFields();
    setPublishProcessPopupOpened(true);

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
    const hasEncryptionCheck = getEncryptionCheck(appletId ?? '');
    if (!hasEncryptionCheck) {
      setIsPasswordPopupOpened(true);

      return;
    }
    await sendRequest();
  };

  const handleAppletPasswordSubmit = async (encryption?: Encryption) => {
    await sendRequest(encryption);
  };

  const sendRequest = async (encryption?: Encryption) => {
    const encryptionData = encryption || appletEncryption;
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
      builderSessionStorage.removeItem();
      if (shouldNavigateRef.current) {
        confirmNavigation();

        return;
      }

      if (appletId && ownerId) {
        await dispatch(getAppletWithItems({ ownerId, appletId }));
        navigate(getBuilderAppletUrl(appletId));
      }
    }

    if (createApplet.fulfilled.match(result)) {
      const createdAppletId = result.payload.data.result?.id;
      builderSessionStorage.removeItem();
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
