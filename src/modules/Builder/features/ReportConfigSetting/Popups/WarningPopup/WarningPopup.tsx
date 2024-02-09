import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { WarningPopupProps } from './WarningPopup.types';

export const WarningPopup = ({ popupVisible, setPopupVisible, submitCallback }: WarningPopupProps) => {
  const { t } = useTranslation('app');

  const onClose = () => setPopupVisible(false);

  const onSubmit = () => {
    onClose();
    submitCallback();
  };

  return (
    <Modal
      open={popupVisible}
      onClose={onClose}
      onSubmit={onSubmit}
      title={t('reportConfiguration')}
      hasSecondBtn
      submitBtnColor="error"
      secondBtnText={t('cancel')}
      onSecondBtnSubmit={onClose}
      buttonText={t('saveAnyway')}
      data-testid="builder-applet-settings-report-config-setting-save-anyway-popup"
    >
      <StyledModalWrapper>
        <Trans i18nKey="saveReportConfigurationWarning">
          A report can not be generated until the <strong>'Encryption Server IP Address'</strong>
          and the <strong>'Public Encryption Key'</strong> are entered.
        </Trans>
      </StyledModalWrapper>
    </Modal>
  );
};
