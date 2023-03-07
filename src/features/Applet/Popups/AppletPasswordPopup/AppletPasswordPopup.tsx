import { RefObject, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import {
  EnterAppletPassword,
  AppletPasswordRef,
} from 'features/Applet/Password/EnterAppletPassword';
import { CreateAppletPassword } from 'features/Applet/Password/CreateAppletPassword';
import { Modal } from 'components';

import { AppletPasswordPopupType, AppletPasswordProps } from './AppletPasswordPopup.types';
import { StyledAppletPasswordContainer } from './AppletPasswordPopup.styles';

export const AppletPasswordPopup = ({
  onClose,
  popupType = AppletPasswordPopupType.Enter,
  popupVisible,
  appletId,
  encryption,
  submitCallback = () => onClose(),
}: AppletPasswordProps) => {
  const { t } = useTranslation('app');

  const appletPasswordRef = useRef() as RefObject<AppletPasswordRef>;

  const submitForm = () => {
    if (appletPasswordRef?.current) {
      appletPasswordRef.current.submitForm();
    }
  };

  return (
    <Modal
      open={popupVisible}
      onClose={onClose}
      onSubmit={submitForm}
      title={
        popupType === AppletPasswordPopupType.Enter
          ? t('enterAppletPassword')
          : t('createAppletPassword')
      }
      buttonText={t('submit')}
    >
      <StyledAppletPasswordContainer>
        {popupType === AppletPasswordPopupType.Enter ? (
          <EnterAppletPassword
            ref={appletPasswordRef}
            appletId={appletId}
            encryption={encryption}
            submitCallback={submitCallback}
          />
        ) : (
          <CreateAppletPassword ref={appletPasswordRef} submitCallback={submitCallback} />
        )}
      </StyledAppletPasswordContainer>
    </Modal>
  );
};
