import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Box } from '@mui/material';
import { DragDropContext, Draggable, DragDropContextProps } from 'react-beautiful-dnd';

import { Svg } from 'shared/components';
import { StyledTitleMedium, theme } from 'shared/styles';
import { useHeaderSticky } from 'shared/hooks';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';
import { InsertItem, DndDroppable } from 'modules/Builder/components';

import { StyledBar, StyledHeader, StyledContent, StyledBtnWrapper } from './LeftBar.styles';
import { LeftBarProps } from './LeftBar.types';
import { Item } from './Item';
import { getItemKey } from '../ActivityItems.utils';

export const LeftBar = ({
  items,
  activeItemId,
  onSetActiveItem,
  onAddItem,
  onInsertItem,
  onDuplicateItem,
  onRemoveItem,
  onMoveItem,
}: LeftBarProps) => {
  const { t } = useTranslation('app');
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);
  const [isDragging, setIsDragging] = useState(false);

  const { name } = useCurrentActivity();

  const handleDragEnd: DragDropContextProps['onDragEnd'] = ({ source, destination }) => {
    setIsDragging(false);
    if (!destination) return;
    onMoveItem(source.index, destination.index);
  };

  return (
    <StyledBar hasActiveItem={!!activeItemId} ref={containerRef}>
      <StyledHeader isSticky={isHeaderSticky}>{t('items')}</StyledHeader>
      <StyledContent>
        {items?.length ? (
          <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
            <DndDroppable droppableId="activity-items-dnd" direction="vertical">
              {(listProvided) => (
                <Box {...listProvided.droppableProps} ref={listProvided.innerRef}>
                  {items?.map((item, index) => (
                    <Draggable
                      key={`item-${getItemKey(item)}`}
                      draggableId={getItemKey(item)}
                      index={index}
                    >
                      {(itemProvided, snapshot) => (
                        <Box {...itemProvided.draggableProps} ref={itemProvided.innerRef}>
                          <Item
                            dragHandleProps={itemProvided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                            item={item}
                            name={`${name}.items[${index}]`}
                            index={index}
                            activeItemId={activeItemId}
                            onSetActiveItem={onSetActiveItem}
                            onDuplicateItem={onDuplicateItem}
                            onRemoveItem={onRemoveItem}
                          />
                          <InsertItem
                            isVisible={index >= 0 && index < items.length - 1 && !isDragging}
                            onInsert={() => onInsertItem(index)}
                          />
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {listProvided.placeholder}
                </Box>
              )}
            </DndDroppable>
          </DragDropContext>
        ) : (
          <StyledTitleMedium sx={{ margin: theme.spacing(1.6, 4, 2.4) }}>
            {t('itemIsRequired')}
          </StyledTitleMedium>
        )}
        <StyledBtnWrapper>
          <Button
            variant="outlined"
            startIcon={<Svg id="add" width={18} height={18} />}
            onClick={onAddItem}
          >
            {t('addItem')}
          </Button>
        </StyledBtnWrapper>
      </StyledContent>
    </StyledBar>
  );
};
