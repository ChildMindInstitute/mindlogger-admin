import { useTranslation } from 'react-i18next';

import { Modal, CreateAppletPassword, EnterAppletPassword } from 'shared/components';
import { useSetupEnterAppletPassword } from 'shared/hooks';
import { Encryption } from 'shared/utils';

import { AppletPasswordPopupType, AppletPasswordPopupProps } from './AppletPasswordPopup.types';
import { StyledAppletPasswordContainer } from './AppletPasswordPopup.styles';

export const AppletPasswordPopup = ({
  onClose,
  popupType = AppletPasswordPopupType.Enter,
  popupVisible,
  appletId,
  encryption,
  submitCallback = () => onClose(),
}: AppletPasswordPopupProps) => {
  const { t } = useTranslation('app');
  const { appletPasswordRef, submitForm } = useSetupEnterAppletPassword();

  const handleSubmitCallback = (generatedEncryption?: Encryption) => {
    const encryptionData =
      popupType === AppletPasswordPopupType.Create ? generatedEncryption : encryption;
    submitCallback(encryptionData!);
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
            submitCallback={handleSubmitCallback}
          />
        ) : (
          <CreateAppletPassword ref={appletPasswordRef} submitCallback={handleSubmitCallback} />
        )}
      </StyledAppletPasswordContainer>
    </Modal>
  );
};
