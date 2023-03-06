import { RefObject, useRef } from 'react';
import { useTranslation } from 'react-i18next';

//import { CreateAppletPassword, EnterAppletPassword } from 'modules/Dashboard/features';
import { Modal } from 'components';

import { AppletPasswordPopupType, AppletPasswordPopupProps } from './AppletPasswordPopup.types';
import { StyledAppletPasswordContainer } from './AppletPasswordPopup.styles';
import { AppletPasswordRef } from '../../Password';

export const AppletPasswordPopup = ({
  onClose,
  popupType = AppletPasswordPopupType.Enter,
  popupVisible,
  appletId,
  encryption,
  submitCallback = () => onClose(),
}: AppletPasswordPopupProps) => {
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
        {/* {popupType === AppletPasswordPopupType.Enter ? (
          <EnterAppletPassword
            ref={appletPasswordRef}
            appletId={appletId}
            encryption={encryption}
            submitCallback={submitCallback}
          />
        ) : (
          <CreateAppletPassword ref={appletPasswordRef} submitCallback={submitCallback} />
        )} */}
      </StyledAppletPasswordContainer>
    </Modal>
  );
};
