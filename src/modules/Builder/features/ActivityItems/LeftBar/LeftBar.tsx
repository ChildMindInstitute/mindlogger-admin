import { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Box } from '@mui/material';
import { DragDropContext, Draggable, DragDropContextProps } from 'react-beautiful-dnd';
import { useFormContext } from 'react-hook-form';

import { Modal, Svg } from 'shared/components';
import {
  StyledBodyLarge,
  StyledFlexAllCenter,
  StyledMaxWidthWrapper,
  StyledModalWrapper,
  StyledTitleMedium,
  theme,
} from 'shared/styles';
import { useHeaderSticky } from 'shared/hooks';
import { getEntityKey, getObjectFromList } from 'shared/utils';
import { ConditionalLogic } from 'shared/state';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { InsertItem, DndDroppable } from 'modules/Builder/components';
import { ItemFormValues } from 'modules/Builder/types';

import { StyledBar, StyledHeaderTitle, StyledContent, StyledBtnWrapper } from './LeftBar.styles';
import { LeftBarProps } from './LeftBar.types';
import { Item } from './Item';
import { ConditionalPanel } from '../ConditionalPanel';
import { getConditionsToRemove } from '../ActivityItems.utils';

export const LeftBar = ({
  activeItemIndex,
  onSetActiveItem,
  onAddItem,
  onInsertItem,
  onDuplicateItem,
  onRemoveItem,
  onMoveItem,
}: LeftBarProps) => {
  const { t } = useTranslation('app');
  const { watch, setValue } = useFormContext();
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);
  const [isDragging, setIsDragging] = useState(false);
  const [conditionalLogicKeysToRemove, setConditionalLogicKeysToRemove] = useState<string[] | null>(
    null,
  );
  const [sourceIndex, setSourceIndex] = useState(-1);
  const [destinationIndex, setDestinationIndex] = useState(-1);

  const { fieldName, activity } = useCurrentActivity();
  const items: ItemFormValues[] = watch(`${fieldName}.items`);
  const activeItemId = getEntityKey(items?.[activeItemIndex]);
  const hasActiveItem = !!activeItemId;
  const movingItemSourceName = items?.[sourceIndex]?.name;
  const groupedConditions = getObjectFromList<ConditionalLogic>(activity.conditionalLogic ?? []);
  const draggableItems = items.filter((item) => item.allowEdit);
  const systemItems = items.filter((item) => !item.allowEdit);

  const handleDragEnd: DragDropContextProps['onDragEnd'] = ({ source, destination }) => {
    setIsDragging(false);
    if (!destination || source.index === destination?.index) return;
    const conditionsToRemove = getConditionsToRemove(items, activity?.conditionalLogic, {
      sourceIndex: source.index,
      destinationIndex: destination.index,
      item: items[source.index],
    });

    if (!conditionsToRemove?.length) return onMoveItem(source.index, destination.index);

    setConditionalLogicKeysToRemove(conditionsToRemove.map((condition) => getEntityKey(condition)));
    setSourceIndex(source.index);
    setDestinationIndex(destination.index);
  };

  const handleCancelRemoveConditionals = () => {
    setSourceIndex(-1);
    setDestinationIndex(-1);
    setConditionalLogicKeysToRemove(null);
  };
  const handleConfirmRemoveConditionals = () => {
    setValue(
      `${fieldName}.conditionalLogic`,
      activity.conditionalLogic?.filter(
        (condition: ConditionalLogic) =>
          !conditionalLogicKeysToRemove?.includes(getEntityKey(condition)),
      ),
    );
    onMoveItem(sourceIndex, destinationIndex);
    handleCancelRemoveConditionals();
  };

  const addItemBtn = (
    <StyledBtnWrapper>
      <Button
        variant="outlined"
        startIcon={<Svg id="add" width={18} height={18} />}
        onClick={onAddItem}
        data-testid="builder-activity-items-add-item"
      >
        {t('addItem')}
      </Button>
    </StyledBtnWrapper>
  );

  return (
    <StyledBar hasActiveItem={hasActiveItem} ref={containerRef}>
      <StyledMaxWidthWrapper>
        <StyledFlexAllCenter sx={{ justifyContent: 'space-between' }}>
          <StyledHeaderTitle isSticky={isHeaderSticky}>{t('items')}</StyledHeaderTitle>
          {!hasActiveItem && addItemBtn}
        </StyledFlexAllCenter>
        <StyledContent>
          {!!draggableItems?.length && (
            <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
              <DndDroppable droppableId="activity-items-dnd" direction="vertical">
                {(listProvided) => (
                  <Box {...listProvided.droppableProps} ref={listProvided.innerRef}>
                    {draggableItems?.map((item, index) => {
                      const dataTestid = `builder-activity-items-item-${index}`;

                      return (
                        <Draggable
                          key={`item-${getEntityKey(item)}`}
                          draggableId={getEntityKey(item)}
                          index={index}
                        >
                          {(itemProvided, snapshot) => (
                            <Box
                              {...itemProvided.draggableProps}
                              ref={itemProvided.innerRef}
                              data-testid={dataTestid}
                            >
                              <Item
                                dragHandleProps={itemProvided.dragHandleProps}
                                isDragging={snapshot.isDragging}
                                item={item}
                                name={`${fieldName}.items[${index}]`}
                                index={index}
                                activeItemId={activeItemId}
                                onSetActiveItem={onSetActiveItem}
                                onDuplicateItem={onDuplicateItem}
                                onRemoveItem={onRemoveItem}
                              />
                              <InsertItem
                                isVisible={index >= 0 && index < items.length - 1 && !isDragging}
                                onInsert={() => onInsertItem(index)}
                                data-testid={`${dataTestid}-insert`}
                              />
                            </Box>
                          )}
                        </Draggable>
                      );
                    })}
                    {listProvided.placeholder}
                  </Box>
                )}
              </DndDroppable>
            </DragDropContext>
          )}
          {!!systemItems?.length &&
            systemItems.map((item) => (
              <Item
                key={`item-${getEntityKey(item)}`}
                item={item}
                activeItemId={activeItemId}
                onSetActiveItem={onSetActiveItem}
                onDuplicateItem={onDuplicateItem}
                onRemoveItem={onRemoveItem}
              />
            ))}
          {!items?.length && (
            <StyledTitleMedium sx={{ margin: theme.spacing(1.6, 4, 2.4) }}>
              {t('itemIsRequired')}
            </StyledTitleMedium>
          )}
          {hasActiveItem && addItemBtn}
          {conditionalLogicKeysToRemove && (
            <Modal
              open
              onClose={handleCancelRemoveConditionals}
              onSubmit={handleConfirmRemoveConditionals}
              onSecondBtnSubmit={handleCancelRemoveConditionals}
              title={t('moveItem')}
              buttonText={t('continue')}
              secondBtnText={t('cancel')}
              hasSecondBtn
              submitBtnColor="error"
              data-testid="builder-activity-items-item-remove-item-with-conditional-popup"
            >
              <StyledModalWrapper>
                <StyledBodyLarge>
                  <Trans i18nKey="removeConditionalsMoveItemPopupDescription">
                    Selected position of the Item
                    <strong>
                      {' '}
                      <>{{ name: movingItemSourceName }}</>{' '}
                    </strong>
                    in the list contradicts the existing Item Flow. If you continue, the following
                    Conditional(s) will be removed:
                  </Trans>
                </StyledBodyLarge>
                <Box sx={{ mt: theme.spacing(2.4) }}>
                  {conditionalLogicKeysToRemove.map((conditionalLogicKey) => (
                    <ConditionalPanel condition={groupedConditions[conditionalLogicKey]} />
                  ))}
                </Box>
              </StyledModalWrapper>
            </Modal>
          )}
        </StyledContent>
      </StyledMaxWidthWrapper>
    </StyledBar>
  );
};
