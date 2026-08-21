import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components/Modal';
import { StyledModalWrapper } from 'shared/styles';

import { SessionTimeoutModalProps } from './SessionTimeoutModal.types';
import { formatCountdown } from './useSessionKeepAlive.utils';

// Closing it any way at all keeps the session: dismissing without answering would leave the
// countdown running behind a modal the user can no longer see.
export const SessionTimeoutModal = ({
  msRemaining,
  onStayLoggedIn,
  onLogOut,
}: SessionTimeoutModalProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open
      onClose={onStayLoggedIn}
      onSubmit={onStayLoggedIn}
      title={t('sessionTimeoutTitle')}
      buttonText={t('stayLoggedIn')}
      hasSecondBtn
      secondBtnText={t('logOut')}
      onSecondBtnSubmit={onLogOut}
      data-testid="session-timeout-modal"
    >
      <StyledModalWrapper>
        {t('sessionTimeoutDescription', { countdown: formatCountdown(msRemaining) })}
      </StyledModalWrapper>
    </Modal>
  );
};
