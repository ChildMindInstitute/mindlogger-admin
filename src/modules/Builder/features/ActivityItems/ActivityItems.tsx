import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslation, Trans } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import { useBreadcrumbs } from 'shared/hooks';
import { StyledContainer, StyledModalWrapper } from 'shared/styles';
import { Modal } from 'shared/components';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { getNewActivityItem } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { ItemFormValues } from 'modules/Builder/pages/BuilderApplet';

import { ItemConfiguration } from './ItemConfiguration';
import { getItemKey } from './ActivityItems.utils';
import { LeftBar } from './LeftBar';

export const ActivityItems = () => {
  const { t } = useTranslation('app');
  const [activeItemId, setActiveItemId] = useState('');
  const [itemIdToDelete, setItemIdToDelete] = useState('');
  const [, setDuplicateIndexes] = useState<Record<string, number>>({});

  const { fieldName, activity } = useCurrentActivity();
  const { control, watch } = useFormContext();

  const {
    append: appendItem,
    insert: insertItem,
    remove: removeItem,
    move: moveItem,
  } = useFieldArray({
    control,
    name: `${fieldName}.items`,
  });

  useBreadcrumbs();

  if (!activity) return null;

  const items = watch(`${fieldName}.items`);
  const activeItemIndex = items?.findIndex(
    (item: ItemFormValues) => (item.key ?? item.id) === activeItemId,
  );
  const itemIndexToDelete = items?.findIndex(
    (item: ItemFormValues) => itemIdToDelete === (item.key ?? item.id),
  );
  const itemToDelete = items[itemIndexToDelete];
  const itemName = itemToDelete?.name;

  const handleRemoveClick = (id: string) => {
    setItemIdToDelete(id);
  };

  const handleAddItem = () => {
    const item = getNewActivityItem();
    appendItem(item);
    setActiveItemId(item.key);
  };

  const handleInsertItem = (index: number) => {
    const item = getNewActivityItem();

    insertItem(index + 1, item);
    setActiveItemId(item.key);
  };

  const handleDuplicateItem = (index: number) => {
    const itemToDuplicate = items[index];
    setDuplicateIndexes((prevState) => {
      const numberToInsert = (prevState[getItemKey(itemToDuplicate)] || 0) + 1;

      insertItem(index + 1, {
        ...itemToDuplicate,
        id: undefined,
        key: uuidv4(),
        name: `${itemToDuplicate.name}_${numberToInsert}`,
      });

      return {
        ...prevState,
        [getItemKey(itemToDuplicate)]: numberToInsert,
      };
    });
  };

  const handleModalClose = () => {
    setItemIdToDelete('');
  };

  const handleModalSubmit = () => {
    if (itemIdToDelete === activeItemId) setActiveItemId('');

    removeItem(itemIndexToDelete);
    handleModalClose();
  };

  return (
    <StyledContainer>
      <LeftBar
        items={items}
        activeItemId={activeItemId}
        onSetActiveItem={setActiveItemId}
        onAddItem={handleAddItem}
        onInsertItem={handleInsertItem}
        onDuplicateItem={handleDuplicateItem}
        onRemoveItem={handleRemoveClick}
        onMoveItem={moveItem}
      />
      {activeItemId && (
        <ItemConfiguration
          key={`item-${activeItemIndex}`}
          name={`${fieldName}.items.${activeItemIndex}`}
          onClose={() => setActiveItemId('')}
        />
      )}
      {!!itemIdToDelete && (
        <Modal
          open={!!itemIdToDelete}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          onSecondBtnSubmit={handleModalClose}
          title={t('deleteItem')}
          buttonText={t('delete')}
          secondBtnText={t('cancel')}
          hasSecondBtn
          submitBtnColor="error"
        >
          <StyledModalWrapper>
            <Trans i18nKey="deleteItemDescription">
              Are you sure you want to delete the Item
              <strong>
                <>{{ itemName }}</>
              </strong>
              ?
            </Trans>
          </StyledModalWrapper>
        </Modal>
      )}
    </StyledContainer>
  );
};
