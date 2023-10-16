import { useParams } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';
import { Box } from '@mui/material';

import { Spinner } from 'shared/components';
import { getEntityKey } from 'shared/utils';
import { useDataPreloader } from 'modules/Builder/hooks/useDataPreloader';
import { StyledObserverTarget } from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { InsertItem } from 'modules/Builder/components';

import { DraggableItemsProps } from './DraggableItems.types';
import { Item } from '../Item';
import { DRAGGABLE_ITEMS_LIST_CLASS, DRAGGABLE_ITEMS_END_ITEM_CLASS } from './DraggableItems.const';

export const DraggableItems = ({
  items,
  listProvided,
  isDragging,
  onRemoveItem,
  onInsertItem,
  onSetActiveItem,
  onDuplicateItem,
}: DraggableItemsProps) => {
  const { itemId } = useParams();
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
    >
      {!isPending &&
        draggableItems.map((item, index) => {
          const dataTestid = `builder-activity-items-item-${index}`;

          return (
            <Draggable
              key={`draggable-item-${getEntityKey(item)}`}
              draggableId={getEntityKey(item)}
              index={index}
            >
              {(itemProvided, snapshot) => (
                <Box
                  {...itemProvided.draggableProps}
                  ref={itemProvided.innerRef}
                  data-testid={dataTestid}
                  sx={{ position: 'relative' }}
                >
                  <Item
                    dragHandleProps={itemProvided.dragHandleProps}
                    isDragging={snapshot.isDragging}
                    item={item}
                    name={`${activityName}.items[${index}]`}
                    index={index}
                    activeItemId={itemId ?? ''}
                    onSetActiveItem={onSetActiveItem}
                    onDuplicateItem={onDuplicateItem}
                    onRemoveItem={onRemoveItem}
                  />
                  <InsertItem
                    isVisible={index >= 0 && index < items.length - 1 && !isDragging}
                    onInsert={() => onInsertItem(index)}
                    data-testid={`${dataTestid}-insert`}
                  />
                  <StyledObserverTarget sx={{ position: 'absolute' }} />
                </Box>
              )}
            </Draggable>
          );
        })}
      <StyledObserverTarget className={DRAGGABLE_ITEMS_END_ITEM_CLASS} />
      {isPending && (
        <Box sx={{ position: 'relative' }}>
          <Spinner />
        </Box>
      )}
    </Box>
  );
};
