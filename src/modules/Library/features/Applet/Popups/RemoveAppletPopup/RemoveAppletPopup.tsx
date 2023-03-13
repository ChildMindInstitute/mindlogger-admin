import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles/styledComponents';

import { RemoveAppletPopupProps } from './RemoveAppletPopup.types';

export const RemoveAppletPopup = ({
  removeAppletPopupVisible,
  setRemoveAppletPopupVisible,
  appletId,
  appletName,
}: RemoveAppletPopupProps) => {
  const { t } = useTranslation('app');

  const handleModalClose = () => setRemoveAppletPopupVisible(false);

  const handleSubmit = () => {
    // TODO: remove applet from cart
    handleModalClose();
  };

  return (
    <Modal
      open={removeAppletPopupVisible}
      onClose={handleModalClose}
      onSubmit={handleSubmit}
      title={t('removeApplet')}
      buttonText={t('yesRemove')}
      submitBtnColor="error"
      hasSecondBtn
      secondBtnText={t('back')}
      onSecondBtnSubmit={handleModalClose}
    >
      <StyledModalWrapper>
        <Trans i18nKey="removeAppletConfirmation">
          Are you sure you want to to remove Applet
          <strong>
            <>{{ appletName }}</>
          </strong>
          from your cart?
        </Trans>
      </StyledModalWrapper>
    </Modal>
  );
};
