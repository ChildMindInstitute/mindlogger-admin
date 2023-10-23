import { useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { StyledBodyLarge, StyledModalWrapper, theme } from 'shared/styles';
import { ConditionalLogic } from 'shared/state';
import { ConditionalPanel } from 'modules/Builder/features/ActivityItems/ConditionalPanel';
import { Modal } from 'shared/components';
import {
  getItemConditionDependencies,
  getItemsWithVariable,
} from 'modules/Builder/features/ActivityItems/ActivityItems.utils';
import { getEntityKey } from 'shared/utils';
import { ItemFormValues, SubscaleFormValue } from 'modules/Builder/types';
import { useCurrentActivity, useFilterConditionalLogicByItem } from 'modules/Builder/hooks';

import { DeleteItemModalProps } from './DeleteItemModal.types';

export const DeleteItemModal = ({
  itemIdToDelete,
  setItemIdToDelete,
  activeItemIndex,
  setActiveItemIndex,
}: DeleteItemModalProps) => {
  const { t } = useTranslation('app');
  const { fieldName, activity } = useCurrentActivity();
  const { watch, setValue, trigger } = useFormContext();
  const subscalesField = `${fieldName}.subscaleSetting.subscales`;
  const subscales: SubscaleFormValue[] = watch(subscalesField) ?? [];
  const items: ItemFormValues[] = watch(`${fieldName}.items`);
  const itemIndexToDelete = items?.findIndex((item) => itemIdToDelete === getEntityKey(item));
  const itemToDelete = items[itemIndexToDelete];
  const itemName = itemToDelete?.name;
  const filterConditionalLogicByItem = useFilterConditionalLogicByItem(itemToDelete);
  const conditionalLogicForItemToDelete = getItemConditionDependencies(
    itemToDelete,
    activity.conditionalLogic,
  );
  const itemsWithVariablesToRemove = getItemsWithVariable(itemToDelete?.name, items);
  const itemsWithVariablesToRemoveString = itemsWithVariablesToRemove
    .map((item) => item.name)
    .join(', ');

  const handleRemoveItem = (index: number) => {
    setValue(`${fieldName}.items`, items?.filter((_, key) => key !== index));

    if (itemsWithVariablesToRemove.length) {
      for (const item of itemsWithVariablesToRemove) {
        trigger(`${fieldName}.items.${index < item.index ? item.index - 1 : item.index}`);
      }
    }

    if (activeItemIndex === index && items?.length !== 1) return setActiveItemIndex(-1);

    if (activeItemIndex === items?.length - 1) setActiveItemIndex((prev) => prev - 1);
  };

  const handleRemoveModalClose = () => {
    setItemIdToDelete('');
  };

  const handleRemoveModalSubmit = () => {
    filterConditionalLogicByItem();
    if (subscales.length) {
      setValue(
        subscalesField,
        subscales.map((subscale) => ({
          ...subscale,
          items: subscale.items.filter((item) => item !== itemIdToDelete),
        })),
      );
      trigger(subscalesField);
    }

    handleRemoveItem(itemIndexToDelete);
    handleRemoveModalClose();
  };

  if (!itemIdToDelete) return null;

  return (
    <Modal
      open={!!itemIdToDelete}
      onClose={handleRemoveModalClose}
      onSubmit={handleRemoveModalSubmit}
      onSecondBtnSubmit={handleRemoveModalClose}
      title={itemsWithVariablesToRemove.length ? t('variablesWarning.title') : t('deleteItem')}
      buttonText={t('delete')}
      secondBtnText={t('cancel')}
      hasSecondBtn
      submitBtnColor="error"
      data-testid="builder-activity-items-delete-item-popup"
    >
      <StyledModalWrapper>
        {itemsWithVariablesToRemove.length ? (
          <StyledBodyLarge sx={{ mb: theme.spacing(2.4) }}>
            <Trans i18nKey="deleteItemReferencedByVariable">
              By deleting{' '}
              <strong>
                {' '}
                <>{{ itemAsVariable: itemName }}</>
              </strong>
              , it will cause{' '}
              <strong>
                {' '}
                <>{{ itemsWithVariablesToRemove: itemsWithVariablesToRemoveString }}</>
              </strong>{' '}
              to fail
            </Trans>
          </StyledBodyLarge>
        ) : (
          <>
            <StyledBodyLarge sx={{ mb: theme.spacing(2.4) }}>
              <Trans i18nKey="deleteItemDescription">
                Are you sure you want to delete the Item
                <strong>
                  <>{{ itemName }}</>
                </strong>
                ?
              </Trans>{' '}
              {conditionalLogicForItemToDelete?.length
                ? t('deleteItemWithConditionalsDescription')
                : null}
            </StyledBodyLarge>
            {conditionalLogicForItemToDelete?.map((conditionalLogic: ConditionalLogic) => (
              <ConditionalPanel
                key={`condition-panel-${conditionalLogic.key}`}
                condition={conditionalLogic}
              />
            ))}
          </>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
