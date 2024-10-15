import { useTranslation } from 'react-i18next';

import { Modal, Spinner } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { ConfirmationPopupProps } from './ConfirmationPopup.types';

export const ConfirmationPopup = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  body,
  isLoading,
  ...rest
}: ConfirmationPopupProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'activityUnassign' });

  return (
    <Modal
      open={isVisible}
      onClose={onClose}
      width="66"
      title={title}
      hasActions
      buttonText={t('confirmationButton')}
      submitBtnColor="error"
      onSubmit={onConfirm}
      {...rest}
    >
      <StyledModalWrapper>
        {isLoading && <Spinner />}

        {body}
      </StyledModalWrapper>
    </Modal>
  );
};
