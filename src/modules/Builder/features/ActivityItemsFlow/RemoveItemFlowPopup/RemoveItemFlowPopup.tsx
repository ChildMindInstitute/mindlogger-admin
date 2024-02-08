import { useTranslation, Trans } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { RemoveItemFlowPopupProps } from './RemoveItemFlowPopup.types';

export const RemoveItemFlowPopup = ({ open, index, onClose, onSubmit }: RemoveItemFlowPopupProps) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      open={open}
      title={t('removeConditionalPopupTitle')}
      onClose={onClose}
      onSubmit={onSubmit}
      buttonText={t('remove')}
      hasSecondBtn
      secondBtnText={t('cancel')}
      submitBtnColor="error"
      onSecondBtnSubmit={onClose}
      data-testid="builder-activity-item-flow-remove-popup">
      <StyledModalWrapper>
        <Trans key="removeConditionalPopupDescription">
          Are you sure you want to remove
          <strong>
            {' '}
            Conditional <>{{ index }} </>
          </strong>
          from the Item Flow?
        </Trans>
      </StyledModalWrapper>
    </Modal>
  );
};
