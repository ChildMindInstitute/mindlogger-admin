import { useState, useEffect } from 'react';
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
  isDragging,
  isStaticActive,
  isInsertVisible,
  onSetActiveItem,
  onDuplicateItem,
  onRemoveItem,
  onInsertItem,
  onChangeItemVisibility,
  'data-testid': dataTestid,
}: DraggableItemProps) => {
  const [isStatic, setStatic] = useState(isStaticActive);

  useIntersectionObserver({
    targetSelector: `.${getObserverSelector(index)}`,
    onAppear: () => setStatic(false),
    onHide: () => setStatic(true),
    isActive: isStaticActive,
  });

  useEffect(() => {
    if (!isStaticActive) setStatic(false);
  }, [isStaticActive]);

  const isStaticVisible = isStatic && !isDragging;

  return (
    <Box sx={{ position: 'relative' }}>
      <Draggable draggableId={itemId} index={index}>
        {(itemProvided, snapshot, rubric) => (
          <Box
            sx={{ position: 'relative' }}
            ref={itemProvided.innerRef}
            {...itemProvided.draggableProps}
            data-testid={dataTestid}
          >
            {isStaticVisible ? (
              <StaticItem data-testid={dataTestid} dragHandleProps={itemProvided.dragHandleProps} />
            ) : (
              <Item
                dragHandleProps={itemProvided.dragHandleProps}
                isDragging={snapshot.isDragging && rubric.draggableId === itemId}
                name={itemName}
                index={index}
                onSetActiveItem={onSetActiveItem}
                onDuplicateItem={onDuplicateItem}
                onRemoveItem={onRemoveItem}
                onChangeItemVisibility={onChangeItemVisibility}
                data-testid={`${dataTestid}-cell`}
              />
            )}
            <InsertItem
              isVisible={isInsertVisible}
              onInsert={() => onInsertItem(index)}
              data-testid={`${dataTestid}-insert-${index}`}
            />
          </Box>
        )}
      </Draggable>
      <StyledObserverTarget
        sx={{ position: 'absolute', height: 'calc(100% + 20rem)', bottom: 0 }}
        className={`${getObserverSelector(index)}`}
      />
    </Box>
  );
};
