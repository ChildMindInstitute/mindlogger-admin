import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, theme } from 'shared/styles';
import { ConditionalLogic } from 'shared/state';
import { ConditionalPanel } from 'modules/Builder/features/ActivityItems/ConditionalPanel';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { getItemConditionDependencies } from 'modules/Builder/features/ActivityItems/ActivityItems.utils';
import { useCustomFormContext } from 'modules/Builder/hooks';

import { EditItemModalProps } from './EditItemModal.types';

export const EditItemModal = ({ open, itemFieldName, onClose, onSubmit }: EditItemModalProps) => {
  const { t } = useTranslation('app');
  const { activity } = useCurrentActivity();
  const { watch } = useCustomFormContext();
  const itemName = watch(`${itemFieldName}.name`);
  const currentItem = watch(itemFieldName);
  const conditionalLogicForItem = getItemConditionDependencies(currentItem, activity?.conditionalLogic);

  const handleModalSubmit = () => {
    onClose();
    onSubmit();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={handleModalSubmit}
      onSecondBtnSubmit={onClose}
      title={t('editItem')}
      buttonText={t('continue')}
      secondBtnText={t('cancel')}
      hasSecondBtn
      submitBtnColor="error"
      data-testid="builder-activity-items-edit-item-popup">
      <StyledModalWrapper>
        <StyledBodyLarge sx={{ mb: theme.spacing(2.4) }}>
          <Trans i18nKey="editItemDescription">
            Are you sure you want to edit Item
            <strong>
              <>{{ itemName }}</>
            </strong>
            ?
          </Trans>{' '}
          {conditionalLogicForItem?.length ? t('deleteItemWithConditionalsDescription') : null}
        </StyledBodyLarge>
        {conditionalLogicForItem?.map((conditionalLogic: ConditionalLogic) => (
          <ConditionalPanel key={`condition-panel-${conditionalLogic.key}`} condition={conditionalLogic} />
        ))}
      </StyledModalWrapper>
    </Modal>
  );
};
