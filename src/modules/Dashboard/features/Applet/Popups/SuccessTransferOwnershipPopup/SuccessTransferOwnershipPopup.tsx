import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper } from 'shared/styles/styledComponents';

import { SuccessTransferOwnershipPopupProps } from './SuccessTransferOwnershipPopup.types';

export const SuccessTransferOwnershipPopup = ({
  email,
  transferOwnershipPopupVisible,
  closeTransferOwnershipPopup,
}: SuccessTransferOwnershipPopupProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={transferOwnershipPopupVisible}
      onClose={closeTransferOwnershipPopup}
      onSubmit={closeTransferOwnershipPopup}
      title={t('transferOwnership')}
      buttonText={t('ok')}
      width="60"
      data-testid="dashboard-applets-transfer-popup-success-popup"
    >
      <StyledModalWrapper>
        <Trans i18nKey="requestTransferOwnershipSuccess">
          <StyledBodyLarge>
            Your request has been successfully sent to
            <strong>
              <>{{ email }}</>
            </strong>
            . Please wait for receiver to accept your request.
          </StyledBodyLarge>
        </Trans>
      </StyledModalWrapper>
    </Modal>
  );
};
