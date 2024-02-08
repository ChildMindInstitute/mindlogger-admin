import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { ServerVerifyErrorPopupProps } from './ServerVerifyErrorPopup.types';

export const ServerVerifyErrorPopup = ({ popupVisible, setPopupVisible }: ServerVerifyErrorPopupProps) => {
  const { t } = useTranslation('app');

  const onClose = () => setPopupVisible(false);

  return (
    <Modal
      open={popupVisible}
      onClose={onClose}
      onSubmit={onClose}
      title={t('reportConfiguration')}
      buttonText={t('ok')}
      data-testid="applet-settings-report-config-verify-server-error-popup">
      <StyledModalWrapper>
        <Trans i18nKey="serverVerifyError">
          Sorry, we were unable to verify the Server. Please check the
          <strong>'Encryption Server IP Address'</strong> and the
          <strong>'Public Encryption Key'</strong> entries.
        </Trans>
      </StyledModalWrapper>
    </Modal>
  );
};
