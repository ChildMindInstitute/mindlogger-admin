import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { builderSessionStorage, getBuilderAppletUrl } from 'shared/utils';
import { Svg } from 'shared/components';
import { applet } from 'shared/state';
import { useAppDispatch } from 'redux/store';
import { useCheckIfNewApplet } from 'shared/hooks';
import {
  AppletPasswordPopup,
  AppletPasswordPopupType,
  EnterAppletPasswordForm,
} from 'modules/Dashboard';
import { SaveAndPublishProcessPopup } from 'modules/Builder/components/Popups/SaveAndPublishProcessPopup';
import { SavaAndPublishStep } from 'modules/Builder/components/Popups/SaveAndPublishProcessPopup/SaveAndPublishProcessPopup.types';

import { StyledButton } from './SaveAndPublish.styles';
import {
  useAppletData,
  useCheckIfHasAtLeastOneActivity,
  useCheckIfHasAtLeastOneItem,
} from './SaveAndPublish.hooks';

export const SaveAndPublish = () => {
  const { t } = useTranslation('app');
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    isLoading && setPublishProcessStep(SavaAndPublishStep.BeingCreated);
  }, [isLoading]);

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

  const handleSubmitCallback = async ({ appletPassword }: EnterAppletPasswordForm) => {
    setAppletPassword(appletPassword);
    await sendRequest(appletPassword);
  };

  const sendRequest = async (appletPassword: EnterAppletPasswordForm['appletPassword']) => {
    setIsLoading(true);
    setPublishProcessPopupOpened(true);
    const body = getAppletData(appletPassword);

    let result;
    if (isNewApplet || !appletId) {
      result = await dispatch(createApplet(body));
    }
    if (!isNewApplet && appletId) {
      result = await dispatch(updateApplet({ appletId, body }));
    }
    setIsLoading(false);
    if (!result) return;

    builderSessionStorage.removeItem();

    if (updateApplet.fulfilled.match(result)) {
      setAppletPassword('');
      setPublishProcessStep(SavaAndPublishStep.Success);
    }
    if (updateApplet.rejected.match(result)) {
      setPublishProcessStep(SavaAndPublishStep.Failed);
    }

    if (!isNewApplet) return;

    if (createApplet.fulfilled.match(result)) {
      const createdAppletId = result.payload.data.result?.id;
      createdAppletId && navigate(getBuilderAppletUrl(createdAppletId));
      setAppletPassword('');
      setPublishProcessStep(SavaAndPublishStep.Success);
    }
    if (createApplet.rejected.match(result)) {
      setPublishProcessStep(SavaAndPublishStep.Failed);
    }
  };

  return (
    <>
      <StyledButton
        variant="contained"
        startIcon={<Svg id="save" width={18} height={18} />}
        onClick={handleSaveAndPublishFirstClick}
      >
        {t('saveAndPublish')}
      </StyledButton>
      <AppletPasswordPopup
        onClose={() => setIsPasswordPopupOpened(false)}
        popupType={isNewApplet ? AppletPasswordPopupType.Create : AppletPasswordPopupType.Enter}
        popupVisible={isPasswordPopupOpened}
        submitCallback={handleSubmitCallback}
      />
      <SaveAndPublishProcessPopup
        isPopupVisible={isPublishProcessPopupOpened}
        step={publishProcessStep}
        onClose={handlePublishProcessOnClose}
        onRetry={handlePublishProcessOnRetry}
      />
    </>
  );
};
