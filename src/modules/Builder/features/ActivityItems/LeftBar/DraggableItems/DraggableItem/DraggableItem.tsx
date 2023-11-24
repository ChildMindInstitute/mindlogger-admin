import { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Box } from '@mui/material';

import { useIntersectionObserver } from 'shared/hooks';
import { StyledObserverTarget } from 'shared/styles';
import { InsertItem } from 'modules/Builder/components';

import { DraggableItemProps } from './DraggableItem.types';
import { getObserverSelector } from './DraggableItem.utils';
import { StaticItem } from '../../StaticItem';
import { Item } from '../../Item';

export const DraggableItem = ({
  itemName,
  index,
  itemId,
  isInsertVisible,
  onSetActiveItem,
  onDuplicateItem,
  onRemoveItem,
  onInsertItem,
  onChangeItemVisibility,
  'data-testid': dataTestid,
}: DraggableItemProps) => {
  const [isStatic, setStatic] = useState(true);

  useIntersectionObserver({
    targetSelector: `.${getObserverSelector(index)}`,
    onAppear: () => setStatic(false),
    onHide: () => setStatic(true),
  });

  return (
    <Box sx={{ position: 'relative' }}>
      {isStatic && <StaticItem data-testid={dataTestid} />}
      {!isStatic && (
        <Draggable draggableId={itemId} index={index}>
          {(itemProvided, snapshot) => (
            <Box
              sx={{ position: 'relative' }}
              ref={itemProvided.innerRef}
              {...itemProvided.draggableProps}
              data-testid={dataTestid}
            >
              <Item
                dragHandleProps={itemProvided.dragHandleProps}
                isDragging={snapshot.isDragging}
                name={itemName}
                index={index}
                onSetActiveItem={onSetActiveItem}
                onDuplicateItem={onDuplicateItem}
                onRemoveItem={onRemoveItem}
                onChangeItemVisibility={onChangeItemVisibility}
              />
              <InsertItem isVisible={isInsertVisible} onInsert={() => onInsertItem(index)} />
            </Box>
          )}
        </Draggable>
      )}
      <StyledObserverTarget
        sx={{ position: 'absolute', height: 'calc(100% + 20rem)', bottom: 0 }}
        className={`${getObserverSelector(index)}`}
      />
    </Box>
  );
};
