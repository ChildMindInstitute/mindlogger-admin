import { useTranslation } from 'react-i18next';

import { Modal, CreateAppletPassword, EnterAppletPassword } from 'shared/components';
import { useSetupEnterAppletPassword } from 'shared/hooks';

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

  const handleSubmitCallback = () => {
    submitCallback(appletPasswordRef);
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
      data-testid="dashboard-applets-password-popup"
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
