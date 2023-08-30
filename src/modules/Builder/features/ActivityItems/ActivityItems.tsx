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
import { ItemFormValues, SubscaleFormValue } from 'modules/Builder/types';

import { ItemConfiguration } from './ItemConfiguration';
import { LeftBar } from './LeftBar';
import { getIndexListToTrigger, getItemConditionDependencies } from './ActivityItems.utils';
import { ConditionalPanel } from './ConditionalPanel';
import { getItemNamesIncludeSkippableItem } from './ItemConfiguration/OptionalItemsAndSettings/SkippedItemInVariablesModal/SkippedItemInVariablesModal.utils';
export const ActivityItems = () => {
  const { t } = useTranslation('app');
  const [activeItemIndex, setActiveItemIndex] = useState(-1);
  const [itemIdToDelete, setItemIdToDelete] = useState('');
  const [, setDuplicateIndexes] = useState<Record<string, number>>({});

  const { fieldName, activity } = useCurrentActivity();
  const { control, watch, setValue, trigger } = useFormContext();

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
  const subscalesField = `${fieldName}.subscaleSetting.subscales`;
  const subscales: SubscaleFormValue[] = watch(subscalesField) ?? [];
  const items: ItemFormValues[] = watch(`${fieldName}.items`);
  const activeItem = items?.find((_, index) => index === activeItemIndex);
  const itemIndexToDelete = items?.findIndex((item) => itemIdToDelete === getEntityKey(item));
  const itemToDelete = items[itemIndexToDelete];
  const itemName = itemToDelete?.name;
  const conditionalLogicForItemToDelete = getItemConditionDependencies(
    itemToDelete,
    activity.conditionalLogic,
  );
  const itemsWithVariablesToRemove = getItemNamesIncludeSkippableItem(itemToDelete?.name, items);
  const itemsWithVariablesToRemoveString = itemsWithVariablesToRemove
    .map((item) => item.name)
    .join(', ');

  const handleRemoveClick = (id: string) => {
    setItemIdToDelete(id);
  };

  const handleRemoveItem = (index: number) => {
    removeItem(index);
    if (itemsWithVariablesToRemove.length) {
      for (const item of itemsWithVariablesToRemove) {
        trigger(`${fieldName}.items.${index < item.index ? item.index - 1 : item.index}`);
      }
    }

    if (activeItemIndex === index && items?.length !== 1) return setActiveItemIndex(-1);

    if (activeItemIndex === items?.length - 1) setActiveItemIndex((prev) => prev - 1);
  };

  const handleAddItem = () => {
    const item = getNewActivityItem();
    const firstSystemIndex = items.findIndex((item) => !item.allowEdit);

    const indexListToTrigger = getIndexListToTrigger(items, item.name);
    for (const itemIndex of indexListToTrigger) {
      trigger(`${fieldName}.items.${itemIndex}`);
    }
    firstSystemIndex === -1 ? appendItem(item) : insertItem(firstSystemIndex, item);
    setActiveItemIndex(firstSystemIndex === -1 ? items?.length : firstSystemIndex);
  };

  const handleInsertItem = (index: number, item?: ItemFormValues) => {
    const itemToInsert = item ?? getNewActivityItem();
    const shouldBecomeActive = !item || (item && getEntityKey(activeItem ?? {}));

    const indexListToTrigger = getIndexListToTrigger(items, itemToInsert.name);
    for (const itemIndex of indexListToTrigger) {
      trigger(`${fieldName}.items.${itemIndex}`);
    }
    insertItem(index + 1, itemToInsert);
    shouldBecomeActive && setActiveItemIndex(index + 1);
  };

  const handleDuplicateItem = (index: number) => {
    const itemToDuplicate = items[index];
    setDuplicateIndexes((prevState) => {
      const numberToInsert = (prevState[getEntityKey(itemToDuplicate)] || 0) + 1;

      handleInsertItem(index, {
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

  const handleMoveItem = (sourceIndex: number, destinationIndex: number) => {
    moveItem(sourceIndex, destinationIndex);
    setActiveItemIndex(destinationIndex);
  };

  const handleRemoveModalClose = () => {
    setItemIdToDelete('');
  };

  const handleRemoveModalSubmit = () => {
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

  return (
    <StyledContainer>
      <LeftBar
        items={items}
        activeItemIndex={activeItemIndex}
        onSetActiveItemIndex={setActiveItemIndex}
        onAddItem={handleAddItem}
        onInsertItem={handleInsertItem}
        onDuplicateItem={handleDuplicateItem}
        onRemoveItem={handleRemoveClick}
        onMoveItem={handleMoveItem}
      />
      {activeItemIndex !== -1 && (
        <ItemConfiguration
          key={`item-${activeItemIndex}`}
          name={`${fieldName}.items.${activeItemIndex}`}
          onClose={() => setActiveItemIndex(-1)}
        />
      )}
      {!!itemIdToDelete && (
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
      )}
    </StyledContainer>
  );
};
