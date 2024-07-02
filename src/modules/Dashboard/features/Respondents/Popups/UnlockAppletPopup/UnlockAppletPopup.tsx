import { useTranslation } from 'react-i18next';

import { Modal, EnterAppletPassword } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';
import { useSetupEnterAppletPassword } from 'shared/hooks';
import { applet as appletState } from 'shared/state';

import { UnlockAppletPopupProps } from './UnlockAppletPopup.types';

export const UnlockAppletPopup = ({
  appletId,
  popupVisible,
  setPopupVisible,
  onSubmitHandler,
}: UnlockAppletPopupProps) => {
  const { t } = useTranslation('app');
  const { appletPasswordRef, submitForm } = useSetupEnterAppletPassword();
  const { useAppletData } = appletState;
  const { result: appletData } = useAppletData() ?? {};

  const handlePopupClose = () => {
    setPopupVisible(false);
  };

  const handleSubmitCallback = () => {
    onSubmitHandler && onSubmitHandler();
    handlePopupClose();
  };

  const dataTestid = 'unlock-applet-data-popup';

  return (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      onSubmit={submitForm}
      title={t('enterAppletPassword')}
      buttonText={t('submit')}
      data-testid={dataTestid}
    >
      <StyledModalWrapper>
        <EnterAppletPassword
          ref={appletPasswordRef}
          appletId={appletId}
          encryption={appletData?.encryption}
          submitCallback={handleSubmitCallback}
          data-testid={`${dataTestid}-enter-password`}
        />
      </StyledModalWrapper>
    </Modal>
  );
};
