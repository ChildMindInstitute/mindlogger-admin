import { useEffect, useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import { StyledContainer } from 'shared/styles';
import { getEntityKey, getUniqueName, pluck } from 'shared/utils';
import { useActivitiesRedirection, useCurrentActivity } from 'modules/Builder/hooks';
import { getNewActivityItem } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { ItemFormValues } from 'modules/Builder/types';
import { page } from 'resources';
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
    move: moveItem,
  } = useFieldArray<Record<string, ItemFormValues[]>, string, typeof REACT_HOOK_FORM_KEY_NAME>({
    control,
    name: itemsName,
    keyName: REACT_HOOK_FORM_KEY_NAME,
  });

  const { appletId, activityId, itemId } = useParams();
  const [activeItemIndex, setActiveItemIndex] = useState(() =>
    itemId ? items?.findIndex((item) => getEntityKey(item) === itemId) : -1,
  );
  const [activeItem, setActiveItem] = useState<ItemFormValues | undefined>(undefined);
  const [itemIdToDelete, setItemIdToDelete] = useState('');

  useActivitiesRedirection();

  useEffect(() => {
    setActiveItem(items?.find((_, index) => index === activeItemIndex));
  }, [activeItemIndex]);

  useEffect(() => {
    navigate(
      generatePath(activeItem ? page.builderAppletActivityItem : page.builderAppletActivityItems, {
        appletId,
        activityId,
        ...(activeItem
          ? {
              itemId: getEntityKey(activeItem),
            }
          : {}),
      }),
    );
  }, [activeItem]);

  if (!activity) return null;

  const handleRemoveClick = (id: string) => {
    setItemIdToDelete(id);
  };

  const handleAddItem = () => {
    const item = getNewActivityItem() as ItemFormValues;
    const firstSystemIndex = items.findIndex((item) => !item.allowEdit);

    const indexListToTrigger = getIndexListToTrigger(items, item.name);
    for (const itemIndex of indexListToTrigger) {
      trigger(`${itemsName}.${itemIndex}`);
    }
    firstSystemIndex === -1 ? appendItem(item) : insertItem(firstSystemIndex, item);
    setActiveItemIndex(firstSystemIndex === -1 ? items?.length : firstSystemIndex);
  };

  const handleInsertItem = (index: number, item?: ItemFormValues) => {
    const itemToInsert = item ?? getNewActivityItem();
    const shouldBecomeActive = !item || (item && getEntityKey(activeItem ?? {}));

    const indexListToTrigger = getIndexListToTrigger(items, itemToInsert.name);
    for (const itemIndex of indexListToTrigger) {
      trigger(`${itemsName}.${itemIndex}`);
    }
    insertItem(index + 1, itemToInsert as ItemFormValues);
    shouldBecomeActive && setActiveItemIndex(index + 1);
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
    setActiveItemIndex(destinationIndex);
  };

  return (
    <StyledContainer>
      <LeftBar
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
          name={`${itemsName}.${activeItemIndex}`}
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
