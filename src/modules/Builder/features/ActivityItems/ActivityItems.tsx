import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import { useBreadcrumbs } from 'shared/hooks';
import { StyledContainer } from 'shared/styles';
import { getEntityKey } from 'shared/utils';
import { useActivitiesRedirection, useCurrentActivity } from 'modules/Builder/hooks';
import { getNewActivityItem } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { ItemFormValues } from 'modules/Builder/types';

import { ItemConfiguration } from './ItemConfiguration';
import { LeftBar } from './LeftBar';
import { getIndexListToTrigger } from './ActivityItems.utils';
import { DeleteItemModal } from './DeleteItemModal';

export const ActivityItems = () => {
  const [activeItemIndex, setActiveItemIndex] = useState(-1);
  const [itemIdToDelete, setItemIdToDelete] = useState('');
  const [, setDuplicateIndexes] = useState<Record<string, number>>({});

  const { fieldName, activity } = useCurrentActivity();
  const { control, watch, trigger } = useFormContext();

  const {
    append: appendItem,
    insert: insertItem,
    move: moveItem,
  } = useFieldArray({
    control,
    name: `${fieldName}.items`,
  });

  useBreadcrumbs();
  useActivitiesRedirection();

  if (!activity) return null;

  const items: ItemFormValues[] = watch(`${fieldName}.items`);
  const activeItem = items?.find((_, index) => index === activeItemIndex);

  const handleRemoveClick = (id: string) => {
    setItemIdToDelete(id);
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
      <DeleteItemModal
        itemIdToDelete={itemIdToDelete}
        setItemIdToDelete={setItemIdToDelete}
        activeItemIndex={activeItemIndex}
        setActiveItemIndex={setActiveItemIndex}
      />
    </StyledContainer>
  );
};
