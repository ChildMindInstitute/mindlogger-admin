import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper } from 'shared/styles';

import { AppletWithoutChangesPopupProps } from './AppletWithoutChangesPopup.types';

export const AppletWithoutChangesPopup = ({
  isPopupVisible,
  onClose,
}: AppletWithoutChangesPopupProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={isPopupVisible}
      onClose={onClose}
      title={t('saveAndPublish')}
      buttonText={t('ok')}
      onSubmit={onClose}
    >
      <StyledModalWrapper>
        <StyledBodyLarge>{t('pleaseMakeChangesToApplet')}</StyledBodyLarge>
      </StyledModalWrapper>
    </Modal>
  );
};
