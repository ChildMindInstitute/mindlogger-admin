import { useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, theme } from 'shared/styles';
import { ConditionalLogic } from 'shared/state';
import { ConditionalPanel } from 'modules/Builder/features/ActivityItems/ConditionalPanel';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { getItemConditionDependencies } from 'modules/Builder/features/ActivityItems/ActivityItems.utils';

import { EditItemModalProps } from './EditItemModal.types';

export const EditItemModal = ({
  itemFieldName,
  isPopupVisible,
  setIsPopupVisible,
  onModalSubmit,
}: EditItemModalProps) => {
  const { t } = useTranslation('app');
  const { activity } = useCurrentActivity();
  const { watch } = useFormContext();
  const itemName = watch(`${itemFieldName}.name`);
  const currentItem = watch(itemFieldName);
  const conditionalLogicForItem = getItemConditionDependencies(
    currentItem,
    activity?.conditionalLogic,
  );

  const handleModalClose = () => {
    setIsPopupVisible(false);
  };

  const handleModalSubmit = () => {
    setIsPopupVisible(false);
    onModalSubmit();
  };

  return (
    <Modal
      open={isPopupVisible}
      onClose={handleModalClose}
      onSubmit={handleModalSubmit}
      onSecondBtnSubmit={handleModalClose}
      title={t('editItem')}
      buttonText={t('continue')}
      secondBtnText={t('cancel')}
      hasSecondBtn
      submitBtnColor="error"
      data-testid="builder-activity-items-edit-item-popup"
    >
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
          <ConditionalPanel
            key={`condition-panel-${conditionalLogic.key}`}
            condition={conditionalLogic}
          />
        ))}
      </StyledModalWrapper>
    </Modal>
  );
};
