import { Box } from '@mui/material';

import { ITEMS_COUNT_TO_ACTIVATE_STATIC, observerStyles } from 'modules/Builder/consts';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { useDataPreloader } from 'modules/Builder/hooks/useDataPreloader';
import { Spinner } from 'shared/components';
import { StyledObserverTarget } from 'shared/styles';
import { getEntityKey } from 'shared/utils';

import { DraggableItem } from './DraggableItem';
import { DRAGGABLE_ITEMS_LIST_CLASS, DRAGGABLE_ITEMS_END_ITEM_CLASS } from './DraggableItems.const';
import { DraggableItemsProps } from './DraggableItems.types';

export const DraggableItems = ({
  items,
  listProvided,
  isDragging,
  onRemoveItem,
  onInsertItem,
  onSetActiveItem,
  onDuplicateItem,
  onChangeItemVisibility,
}: DraggableItemsProps) => {
  const { fieldName: activityName } = useCurrentActivity();

  const { data: draggableItems, isPending } = useDataPreloader({
    data: items,
    rootSelector: `.${DRAGGABLE_ITEMS_LIST_CLASS}`,
    targetSelector: `.${DRAGGABLE_ITEMS_END_ITEM_CLASS}`,
  });

  return (
    <Box
      {...listProvided.droppableProps}
      ref={listProvided.innerRef}
      className={DRAGGABLE_ITEMS_LIST_CLASS}
      sx={{ position: 'relative' }}
    >
      {!isPending &&
        draggableItems.map((item, index) => {
          const dataTestid = `builder-activity-items-item-${index}`;
          const itemName = `${activityName}.items.${index}`;
          const itemId = getEntityKey(item);

          return (
            <DraggableItem
              key={`draggable-item-${itemId}-${index}`}
              itemName={itemName}
              index={index}
              itemId={itemId}
              isDragging={isDragging}
              isStaticActive={draggableItems.length > ITEMS_COUNT_TO_ACTIVATE_STATIC}
              isInsertVisible={index >= 0 && index < draggableItems.length - 1 && !isDragging}
              onSetActiveItem={() => onSetActiveItem(item)}
              onDuplicateItem={() => onDuplicateItem(index)}
              onRemoveItem={() => onRemoveItem(itemId)}
              onChangeItemVisibility={() => onChangeItemVisibility(itemName)}
              onInsertItem={onInsertItem}
              data-testid={dataTestid}
            />
          );
        })}
      <StyledObserverTarget className={DRAGGABLE_ITEMS_END_ITEM_CLASS} sx={observerStyles} />
      {isPending && (
        <Box sx={{ position: 'relative' }}>
          <Spinner />
        </Box>
      )}
    </Box>
  );
};
