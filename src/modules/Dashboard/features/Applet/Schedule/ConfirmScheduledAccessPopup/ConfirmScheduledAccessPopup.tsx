import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles/styledComponents';

import { ConfirmScheduledAccessPopupProps } from './ConfirmScheduledAccess.types';

export const ConfirmScheduledAccessPopup = ({
  open,
  onClose,
  onSubmit,
  activityName,
}: ConfirmScheduledAccessPopupProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={t('confirmScheduledAccess')}
      buttonText={t('confirm')}
      hasSecondBtn
      secondBtnText={t('cancel')}
      onSecondBtnSubmit={onClose}
    >
      <StyledModalWrapper>
        <Trans i18nKey="confirmChangeOnScheduledAccess">
          Activity
          <strong>
            <> {{ activityName }} </>
          </strong>
          will no longer be always available, and the Activity will be a scheduled event. Are you
          sure you want to continue?
        </Trans>
      </StyledModalWrapper>
    </Modal>
  );
};
