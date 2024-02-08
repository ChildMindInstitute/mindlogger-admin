import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { useCheckIfItemHasVariables } from './SkippedItemInVariablesModal.hooks';
import { SkippedItemInVariablesModalProps } from './SkippedItemInVariablesModal.types';

export const SkippedItemInVariablesModal = ({ itemName }: SkippedItemInVariablesModalProps) => {
  const { t } = useTranslation('app');
  const { isPopupVisible, skippedItemName, itemNamesWithSkippedItem, onPopupConfirm } =
    useCheckIfItemHasVariables(itemName);

  if (!isPopupVisible) return null;

  return (
    <Modal
      open={isPopupVisible}
      onClose={onPopupConfirm}
      onSubmit={onPopupConfirm}
      width={'62'}
      title={t('variablesWarning.title')}
      buttonText={t('ok')}
      data-testid="builder-activity-items-item-configuration-skipped-item-in-vars-popup">
      <StyledModalWrapper>
        <Trans i18nKey="variablesWarning.skippedItemInVariables">
          By skipping{' '}
          <strong>
            <>{{ skippedItemName }}</>
          </strong>
          , it will cause
          <strong>
            <>{{ itemNamesWithSkippedItem }}</>
          </strong>{' '}
          to fail
        </Trans>
      </StyledModalWrapper>
    </Modal>
  );
};
