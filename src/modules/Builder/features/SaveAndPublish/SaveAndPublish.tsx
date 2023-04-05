import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

import { builderSessionStorage, getBuilderAppletUrl } from 'shared/utils';
import { Svg } from 'shared/components';
import { applet } from 'shared/state';
import { useAppDispatch } from 'redux/store';
import { updateApplet } from 'shared/state/Applet/Applet.thunk';
import { useCheckIfNewApplet } from 'shared/hooks';
import {
  AppletPasswordPopup,
  AppletPasswordPopupType,
  EnterAppletPasswordForm,
} from 'modules/Dashboard';

import { StyledButton } from './SaveAndPublish.styles';
import { useAppletData } from './SaveAndPublish.hooks';

export const SaveAndPublish = () => {
  const { t } = useTranslation('app');
  const getAppletData = useAppletData();
  const { createApplet } = applet.thunk;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { appletId } = useParams();
  const isNewApplet = useCheckIfNewApplet();
  const [isPasswordPopupOpened, setIsPasswordPopupOpened] = useState(false);

  const sendRequest = async ({ appletPassword }: EnterAppletPasswordForm) => {
    const body = getAppletData(appletPassword);

    let result;
    if (isNewApplet || !appletId) {
      result = await dispatch(createApplet(body));
    }
    if (!isNewApplet && appletId) {
      result = await dispatch(updateApplet({ appletId, body }));
    }
    if (!result) return;

    builderSessionStorage.removeItem();

    if (isNewApplet && createApplet.fulfilled.match(result)) {
      const createdAppletId = result.payload.data.result?.id;
      createdAppletId && navigate(getBuilderAppletUrl(createdAppletId));
    }

    if (!isNewApplet && appletId) navigate(getBuilderAppletUrl(appletId));
  };

  return (
    <>
      <StyledButton
        variant="contained"
        startIcon={<Svg id="save" width={18} height={18} />}
        onClick={() => {
          setIsPasswordPopupOpened(true);
        }}
      >
        {t('saveAndPublish')}
      </StyledButton>
      <AppletPasswordPopup
        onClose={() => setIsPasswordPopupOpened(false)}
        popupType={isNewApplet ? AppletPasswordPopupType.Create : AppletPasswordPopupType.Enter}
        popupVisible={isPasswordPopupOpened}
        submitCallback={sendRequest}
      />
    </>
  );
};
