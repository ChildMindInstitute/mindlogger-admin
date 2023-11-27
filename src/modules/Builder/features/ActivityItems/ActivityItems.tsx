import { useState } from 'react';
import { useNavigate, useParams, generatePath } from 'react-router-dom';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import { page } from 'resources';
import { StyledContainer } from 'shared/styles';
import { getEntityKey, pluck } from 'shared/utils';
import { useRedirectIfNoMatchedActivity, useCurrentActivity } from 'modules/Builder/hooks';
import { getNewActivityItem } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { ItemFormValues } from 'modules/Builder/types';
import { getUniqueName } from 'modules/Builder/utils';
import { REACT_HOOK_FORM_KEY_NAME } from 'modules/Builder/consts';

import { ItemConfiguration } from './ItemConfiguration/ItemConfiguration';
import { LeftBar } from './LeftBar';
import { getIndexListToTrigger } from './ActivityItems.utils';
import { DeleteItemModal } from './DeleteItemModal';

export const ActivityItems = () => {
  const { fieldName, activity } = useCurrentActivity();
  const { control, trigger, getValues } = useFormContext();
  const itemsName = `${fieldName}.items`;
  const navigate = useNavigate();

  const {
    fields: items,
    append: appendItem,
    insert: insertItem,
    remove: removeItem,
    move: moveItem,
  } = useFieldArray<Record<string, ItemFormValues[]>, string, typeof REACT_HOOK_FORM_KEY_NAME>({
    control,
    name: itemsName,
    keyName: REACT_HOOK_FORM_KEY_NAME,
  });

  const { appletId, activityId, itemId } = useParams();
  const activeItemIndex = itemId ? items?.findIndex((item) => getEntityKey(item) === itemId) : -1;
  const activeItem =
    activeItemIndex === undefined || activeItemIndex === -1 ? undefined : items[activeItemIndex];
  const [itemIdToDelete, setItemIdToDelete] = useState('');

  useRedirectIfNoMatchedActivity();

  const navigateToItem = (item?: ItemFormValues) => {
    const path = item ? page.builderAppletActivityItem : page.builderAppletActivityItems;

    navigate(
      generatePath(path, {
        appletId,
        activityId,
        ...(item && { itemId: getEntityKey(item) }),
      }),
    );
  };

  if (!activity) return null;

  const handleRemoveClick = (id: string) => {
    setItemIdToDelete(id);
  };

  const handleAddItem = () => {
    const item = getNewActivityItem();
    const firstSystemIndex = items.findIndex((item) => !item.allowEdit);

    const indexListToTrigger = getIndexListToTrigger(items, item.name);
    for (const itemIndex of indexListToTrigger) {
      trigger(`${itemsName}.${itemIndex}`);
    }

    firstSystemIndex === -1 ? appendItem(item) : insertItem(firstSystemIndex, item);

    navigateToItem(item);
  };

  const handleInsertItem = (index: number, item?: ItemFormValues) => {
    const itemToInsert = item ?? getNewActivityItem();
    const shouldBecomeActive = !item || (item && getEntityKey(activeItem ?? {}));

    const indexListToTrigger = getIndexListToTrigger(items, itemToInsert.name);
    for (const itemIndex of indexListToTrigger) {
      trigger(`${itemsName}.${itemIndex}`);
    }
    insertItem(index + 1, itemToInsert);
    shouldBecomeActive && navigateToItem(itemToInsert);
  };

  const handleDuplicateItem = (index: number) => {
    const itemsValues = getValues(itemsName);
    const itemToDuplicate = itemsValues[index];

    handleInsertItem(index, {
      ...itemToDuplicate,
      id: undefined,
      key: uuidv4(),
      name: getUniqueName({
        name: itemToDuplicate.name,
        existingNames: pluck(itemsValues, 'name'),
        withUnderscore: true,
      }),
    });
  };

  const handleMoveItem = (sourceIndex: number, destinationIndex: number) => {
    moveItem(sourceIndex, destinationIndex);
  };

  const handleRemoveItem = (index: number) => {
    removeItem(index);
  };

  const handleDeleteModalClose = () => {
    setItemIdToDelete('');
  };

  return (
    <StyledContainer>
      <LeftBar
        activeItemIndex={activeItemIndex}
        onSetActiveItem={navigateToItem}
        onAddItem={handleAddItem}
        onInsertItem={handleInsertItem}
        onDuplicateItem={handleDuplicateItem}
        onRemoveItem={handleRemoveClick}
        onMoveItem={handleMoveItem}
      />
      {activeItemIndex !== -1 && (
        <ItemConfiguration
          key={`item-${activeItemIndex}`}
          name={`${itemsName}.${activeItemIndex}`}
          onClose={() => navigateToItem()}
        />
      )}
      {!!itemIdToDelete && (
        <DeleteItemModal
          itemIdToDelete={itemIdToDelete}
          activeItemIndex={activeItemIndex}
          onClose={handleDeleteModalClose}
          onRemoveItem={handleRemoveItem}
          onSetActiveItem={navigateToItem}
        />
      )}
    </StyledContainer>
  );
};
