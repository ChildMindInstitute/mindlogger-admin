import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Box } from '@mui/material';
import { DragDropContext, DragDropContextProps } from 'react-beautiful-dnd';
import { useFormContext, useWatch } from 'react-hook-form';

import { Modal, Spinner, Svg } from 'shared/components';
import {
  StyledBodyLarge,
  StyledFlexAllCenter,
  StyledModalWrapper,
  StyledObserverTarget,
  StyledTitleMedium,
  theme,
  variables,
} from 'shared/styles';
import { getEntityKey, getObjectFromList } from 'shared/utils';
import { ConditionalLogic } from 'shared/state';
import { BuilderContainer } from 'shared/features';
import { useCurrentActivity } from 'modules/Builder/hooks/useCurrentActivity';
import { DndDroppable } from 'modules/Builder/components/DndDroppable';
import { ItemFormValues } from 'modules/Builder/types';
import { useDataPreloader } from 'modules/Builder/hooks/useDataPreloader';
import { useRedirectIfNoMatchedActivityItem } from 'modules/Builder/hooks/useRedirectIfNoMatchedActivityItem';

import { LeftBarProps } from './LeftBar.types';
import { Item } from './Item';
import { LeftBarHeader } from './LeftBarHeader';
import { ACTIVITY_ITEMS_LIST_CLASS, ACTIVITY_ITEMS_END_ITEM_CLASS } from './LeftBar.const';
import { ConditionalPanel } from '../ConditionalPanel';
import { getConditionsToRemove } from '../ActivityItems.utils';
import { DraggableItems } from './DraggableItems';

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
  const { setValue } = useFormContext();
  const [isDragging, setIsDragging] = useState(false);
  const [conditionalLogicKeysToRemove, setConditionalLogicKeysToRemove] = useState<string[] | null>(
    null,
  );
  const [sourceIndex, setSourceIndex] = useState(-1);
  const [destinationIndex, setDestinationIndex] = useState(-1);

  const { fieldName, activity } = useCurrentActivity();
  const items: ItemFormValues[] = useWatch({ name: `${fieldName}.items` });
  const activeItemId = getEntityKey(items?.[activeItemIndex]);
  const hasActiveItem = !!activeItemId;
  const movingItemSourceName = items?.[sourceIndex]?.name;
  const groupedConditions = getObjectFromList<ConditionalLogic>(activity.conditionalLogic ?? []);

  const { data: itemsData, isPending } = useDataPreloader<ItemFormValues>({
    data: items,
    rootSelector: `.${ACTIVITY_ITEMS_LIST_CLASS}`,
    targetSelector: `.${ACTIVITY_ITEMS_END_ITEM_CLASS}`,
  });
  const draggableItems = itemsData.filter((item) => item.allowEdit);
  const systemItems = itemsData.filter((item) => !item.allowEdit);

  useRedirectIfNoMatchedActivityItem();

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

  const handleSetActiveItem = (item: ItemFormValues) => {
    onSetActiveItem(item);
  };

  const addItemBtn = (
    <Button
      variant="outlined"
      startIcon={<Svg id="add" width={18} height={18} />}
      onClick={onAddItem}
      data-testid="builder-activity-items-add-item"
    >
      {t('addItem')}
    </Button>
  );

  const containerSxProps = {
    width: hasActiveItem ? '40rem' : '100%',
    flexShrink: 0,
    borderRight: `${variables.borderWidth.md} solid ${variables.palette.surface_variant}`,
    height: '100%',
    transition: variables.transitions.width,
    margin: 0,
  };

  return (
    <BuilderContainer
      title={t('items')}
      Header={LeftBarHeader}
      headerProps={{ hasActiveItem, onAddItem }}
      sxProps={containerSxProps}
      contentSxProps={{
        padding: theme.spacing(0, 1.6, 2.8),
      }}
      contentClassName={ACTIVITY_ITEMS_LIST_CLASS}
      hasMaxWidth={!hasActiveItem}
    >
      {!!draggableItems?.length && (
        <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
          <DndDroppable droppableId="activity-items-dnd" direction="vertical">
            {(listProvided) => (
              <DraggableItems
                items={draggableItems}
                listProvided={listProvided}
                isDragging={isDragging}
                onRemoveItem={onRemoveItem}
                onInsertItem={onInsertItem}
                onSetActiveItem={handleSetActiveItem}
                onDuplicateItem={onDuplicateItem}
              />
            )}
          </DndDroppable>
        </DragDropContext>
      )}
      {!!systemItems?.length &&
        systemItems.map((item, index) => (
          <Item
            key={`item-${getEntityKey(item)}`}
            item={item}
            index={index}
            activeItemId={activeItemId}
            onSetActiveItem={handleSetActiveItem}
            onDuplicateItem={onDuplicateItem}
            onRemoveItem={onRemoveItem}
          />
        ))}
      {!itemsData?.length && (
        <StyledTitleMedium sx={{ margin: theme.spacing(1.6, 4, 2.4) }}>
          {t('itemIsRequired')}
        </StyledTitleMedium>
      )}
      <StyledObserverTarget className={ACTIVITY_ITEMS_END_ITEM_CLASS} />
      {isPending && (
        <Box sx={{ position: 'relative' }}>
          <Spinner />
        </Box>
      )}
      {hasActiveItem && <StyledFlexAllCenter>{addItemBtn}</StyledFlexAllCenter>}
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
    </BuilderContainer>
  );
};
