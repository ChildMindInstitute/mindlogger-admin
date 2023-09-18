import { useEffect, useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import { useBreadcrumbs } from 'shared/hooks';
import { StyledContainer } from 'shared/styles';
import { getEntityKey } from 'shared/utils';
import { useActivitiesRedirection, useCurrentActivity } from 'modules/Builder/hooks';
import { getNewActivityItem } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { ItemFormValues } from 'modules/Builder/types';
import { page } from 'resources';
import { REACT_HOOK_FORM_KEY_NAME } from 'modules/Builder/consts';

import { ItemConfiguration } from './ItemConfiguration';
import { LeftBar } from './LeftBar';
import { getIndexListToTrigger } from './ActivityItems.utils';
import { DeleteItemModal } from './DeleteItemModal';

export const ActivityItems = () => {
  const [activeItemIndex, setActiveItemIndex] = useState(-1);
  const [itemIdToDelete, setItemIdToDelete] = useState('');
  const [, setDuplicateIndexes] = useState<Record<string, number>>({});

  const { fieldName, activity } = useCurrentActivity();
  const { appletId, activityId } = useParams();
  const { control, trigger } = useFormContext();
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

  useBreadcrumbs();
  useActivitiesRedirection();

  const activeItem = items?.find((_, index) => index === activeItemIndex);

  useEffect(() => {
    if (activeItem) {
      return navigate(
        generatePath(page.builderAppletActivityItem, {
          appletId,
          activityId,
          item: getEntityKey(activeItem),
        }),
      );
    }

    navigate(
      generatePath(page.builderAppletActivityItems, {
        appletId,
        activityId,
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
