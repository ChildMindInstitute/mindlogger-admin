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
  'data-testid': dataTestid,
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
      data-testid={dataTestid}
      disabledSubmit={!!appletPasswordRef?.current}
    >
      <StyledAppletPasswordContainer>
        {popupType === AppletPasswordPopupType.Enter ? (
          <EnterAppletPassword
            ref={appletPasswordRef}
            appletId={appletId}
            encryption={encryption}
            submitCallback={handleSubmitCallback}
            data-testid={`${dataTestid}-enter-password`}
          />
        ) : (
          <CreateAppletPassword
            ref={appletPasswordRef}
            submitCallback={handleSubmitCallback}
            data-testid={`${dataTestid}-create-password`}
          />
        )}
      </StyledAppletPasswordContainer>
    </Modal>
  );
};
