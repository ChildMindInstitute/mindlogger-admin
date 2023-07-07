import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslation, Trans } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import { useBreadcrumbs } from 'shared/hooks';
import { StyledBodyLarge, StyledContainer, StyledModalWrapper, theme } from 'shared/styles';
import { Modal } from 'shared/components';
import { getEntityKey } from 'shared/utils';
import { ConditionalLogic } from 'shared/state';
import { useActivitiesRedirection, useCurrentActivity } from 'modules/Builder/hooks';
import { getNewActivityItem } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { ItemFormValues } from 'modules/Builder/types';

import { ItemConfiguration } from './ItemConfiguration';
import { LeftBar } from './LeftBar';
import { getItemConditionDependencies } from './ActivityItems.utils';
import { ConditionalPanel } from './ConditionalPanel';

export const ActivityItems = () => {
  const { t } = useTranslation('app');
  const [activeItemId, setActiveItemId] = useState('');
  const [itemIdToDelete, setItemIdToDelete] = useState('');
  const [, setDuplicateIndexes] = useState<Record<string, number>>({});

  const { fieldName, activity } = useCurrentActivity();
  const { control, watch, setValue } = useFormContext();

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
  useActivitiesRedirection();

  if (!activity) return null;

  const conditionalLogic = watch(`${fieldName}.conditionalLogic`);
  const items: ItemFormValues[] = watch(`${fieldName}.items`);
  const activeItemIndex = items?.findIndex((item) => getEntityKey(item) === activeItemId);
  const itemIndexToDelete = items?.findIndex((item) => itemIdToDelete === getEntityKey(item));
  const itemToDelete = items[itemIndexToDelete];
  const itemName = itemToDelete?.name;
  const conditionalLogicForItemToDelete = getItemConditionDependencies(
    itemToDelete,
    activity.conditionalLogic,
  );

  const handleRemoveClick = (id: string) => {
    setItemIdToDelete(id);
  };

  const handleAddItem = () => {
    const item = getNewActivityItem();
    const firstSystemIndex = items.findIndex((item) => !item.allowEdit);

    firstSystemIndex === -1 ? appendItem(item) : insertItem(firstSystemIndex, item);
    setActiveItemId(item.key!);
  };

  const handleInsertItem = (index: number) => {
    const item = getNewActivityItem();

    insertItem(index + 1, item);
    setActiveItemId(item.key!);
  };

  const handleDuplicateItem = (index: number) => {
    const itemToDuplicate = items[index];
    setDuplicateIndexes((prevState) => {
      const numberToInsert = (prevState[getEntityKey(itemToDuplicate)] || 0) + 1;

      insertItem(index + 1, {
        ...itemToDuplicate,
        id: undefined,
        key: uuidv4(),
        name: `${itemToDuplicate.name}_${numberToInsert}`,
      });

      return {
        ...prevState,
        [getEntityKey(itemToDuplicate)]: numberToInsert,
      };
    });
  };

  const handleRemoveModalClose = () => {
    setItemIdToDelete('');
  };

  const handleRemoveModalSubmit = () => {
    if (itemIdToDelete === activeItemId) setActiveItemId('');
    if (conditionalLogicForItemToDelete?.length) {
      const conditionalLogicKeysToRemove = conditionalLogicForItemToDelete.map(
        (condition: ConditionalLogic) => getEntityKey(condition),
      );
      setValue(
        `${fieldName}.conditionalLogic`,
        conditionalLogic?.filter(
          (conditionalLogic: ConditionalLogic) =>
            !conditionalLogicKeysToRemove.includes(getEntityKey(conditionalLogic)),
        ),
      );
    }

    removeItem(itemIndexToDelete);
    handleRemoveModalClose();
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
          onClose={handleRemoveModalClose}
          onSubmit={handleRemoveModalSubmit}
          onSecondBtnSubmit={handleRemoveModalClose}
          title={t('deleteItem')}
          buttonText={t('delete')}
          secondBtnText={t('cancel')}
          hasSecondBtn
          submitBtnColor="error"
        >
          <StyledModalWrapper>
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
          </StyledModalWrapper>
        </Modal>
      )}
    </StyledContainer>
  );
};
