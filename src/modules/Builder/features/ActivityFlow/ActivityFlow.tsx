import React, { useState, useCallback, useMemo } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFieldArray } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Draggable, DragDropContextProps } from 'react-beautiful-dnd';
import { Box } from '@mui/material';

import { StyledTitleMedium, theme } from 'shared/styles';
import { BuilderContainer } from 'shared/features';
import { getEntityKey, pluck } from 'shared/utils';
import { DndDroppable, Item, ItemUiType, InsertItem } from 'modules/Builder/components';
import { page } from 'resources';
import { getNewActivityFlow } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { REACT_HOOK_FORM_KEY_NAME } from 'modules/Builder/consts';
import {
  ActivityFlowFormValues,
  ActivityFlowItem,
  ActivityFormValues,
} from 'modules/Builder/types';
import { getUniqueName } from 'modules/Builder/utils';
import { useCustomFormContext } from 'modules/Builder/hooks';

import { DeleteFlowModal } from './DeleteFlowModal';
import { getDuplicatedActivityFlow, getFlowsItemActions } from './ActivityFlow.utils';
import { ActivityFlowHeader } from './ActivityFlowHeader';

// Memoized Flow Item component for better performance
const FlowDraggableItem = React.memo<{
  flow: ActivityFlowFormValues;
  index: number;
  activityFlowKey: string;
  isDragging: boolean;
  isLastItem: boolean;
  hasError: boolean;
  dataTestid: string;
  handleEditActivityFlow: (activityFlowId: string) => void;
  handleSetFlowToDeleteData: (index: number, name: string) => () => void;
  handleDuplicateActivityFlow: (index: number) => void;
  handleToggleActivityFlowVisibility: (index: number) => void;
  handleAddActivityFlow: (positionToAdd?: number) => void;
}>(
  ({
    flow,
    index,
    activityFlowKey,
    isDragging,
    isLastItem,
    hasError,
    dataTestid,
    handleEditActivityFlow,
    handleSetFlowToDeleteData,
    handleDuplicateActivityFlow,
    handleToggleActivityFlowVisibility,
    handleAddActivityFlow,
  }) => {
    const getActivityFlowVisible = (isHidden: boolean | undefined) =>
      isHidden === undefined ? false : isHidden;

    return (
      <Draggable key={activityFlowKey} draggableId={activityFlowKey} index={index}>
        {(itemProvided, snapshot) => (
          <Box
            {...itemProvided.draggableProps}
            ref={itemProvided.innerRef}
            data-testid={dataTestid}
          >
            <Item
              dragHandleProps={itemProvided.dragHandleProps}
              isDragging={snapshot.isDragging}
              onItemClick={() => handleEditActivityFlow(activityFlowKey)}
              getActions={() =>
                getFlowsItemActions({
                  activityFlowIndex: index,
                  activityFlowId: activityFlowKey,
                  activityFlowHidden: getActivityFlowVisible(flow.isHidden),
                  removeActivityFlow: handleSetFlowToDeleteData(index, flow.name),
                  editActivityFlow: handleEditActivityFlow,
                  duplicateActivityFlow: handleDuplicateActivityFlow,
                  toggleActivityFlowVisibility: handleToggleActivityFlowVisibility,
                  'data-testid': dataTestid,
                })
              }
              isInactive={flow.isHidden}
              hasStaticActions={flow.isHidden}
              uiType={ItemUiType.Flow}
              hasError={hasError}
              {...flow}
              data-testid={dataTestid}
            />
            <InsertItem
              isVisible={!isLastItem && !isDragging}
              onInsert={() => handleAddActivityFlow(index + 1)}
              data-testid={`${dataTestid}-insert`}
            />
          </Box>
        )}
      </Draggable>
    );
  },
);

FlowDraggableItem.displayName = 'FlowDraggableItem';

export const ActivityFlow = () => {
  const [flowToDeleteData, setFlowToDeleteData] = useState<{
    index: number;
    name: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useTranslation('app');
  const { watch, control, getFieldState } = useCustomFormContext();
  const { appletId } = useParams();
  const navigate = useNavigate();

  const activities: ActivityFormValues[] = watch('activities');

  const {
    fields: activityFlows,
    remove: removeActivityFlow,
    append: appendActivityFlow,
    insert: insertActivityFlow,
    update: updateActivityFlow,
    move: moveActivityFlow,
  } = useFieldArray<
    Record<string, ActivityFlowFormValues[]>,
    string,
    typeof REACT_HOOK_FORM_KEY_NAME
  >({
    control,
    name: 'activityFlows',
    keyName: REACT_HOOK_FORM_KEY_NAME,
  });

  const errors = useMemo(
    () => activityFlows?.map((_, index) => !!getFieldState(`activityFlows.${index}`).error),
    [activityFlows, getFieldState],
  );

  const handleFlowDelete = useCallback(() => {
    if (!flowToDeleteData) return;

    removeActivityFlow(flowToDeleteData.index);
    setFlowToDeleteData(null);
  }, [flowToDeleteData, removeActivityFlow]);

  const handleEditActivityFlow = useCallback(
    (activityFlowId: string) =>
      navigate(
        generatePath(page.builderAppletActivityFlowItem, {
          appletId,
          activityFlowId,
        }),
      ),
    [navigate, appletId],
  );

  const handleAddActivityFlow = useCallback(
    (positionToAdd?: number) => {
      // remove Reviewer Assessment Activity from Flow Items list
      const flowItems = activities.reduce((acc: ActivityFlowItem[], activity) => {
        if (!activity.isReviewable) {
          acc.push({
            key: uuidv4(),
            activityKey: getEntityKey(activity),
          });
        }

        return acc;
      }, []);

      const newActivityFlow = { ...getNewActivityFlow(), items: flowItems };

      if (positionToAdd) {
        insertActivityFlow(positionToAdd, newActivityFlow);
      } else {
        appendActivityFlow(newActivityFlow);
      }
      handleEditActivityFlow(newActivityFlow.key);
    },
    [activities, insertActivityFlow, appendActivityFlow, handleEditActivityFlow],
  );

  const handleDuplicateActivityFlow = useCallback(
    (index: number) => {
      const name = getUniqueName({
        name: activityFlows[index].name,
        existingNames: pluck(activityFlows, 'name'),
      });

      insertActivityFlow(index + 1, getDuplicatedActivityFlow(activityFlows[index], name));
    },
    [activityFlows, insertActivityFlow],
  );

  const handleToggleActivityFlowVisibility = useCallback(
    (index: number) =>
      updateActivityFlow(index, {
        ...activityFlows[index],
        isHidden: !activityFlows[index].isHidden,
      }),
    [activityFlows, updateActivityFlow],
  );

  const handleSetFlowToDeleteData = useCallback(
    (index: number, name: string) => () => setFlowToDeleteData({ index, name }),
    [],
  );

  const handleDragEnd = useCallback<DragDropContextProps['onDragEnd']>(
    ({ source, destination }) => {
      setIsDragging(false);
      if (!destination) return;
      moveActivityFlow(source.index, destination.index);
    },
    [moveActivityFlow],
  );

  return (
    <BuilderContainer
      title={t('activityFlows')}
      Header={ActivityFlowHeader}
      headerProps={{ onAddActivityFlow: handleAddActivityFlow }}
      hasMaxWidth
    >
      {activityFlows?.length ? (
        <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
          <DndDroppable
            droppableId="activity-flows-dnd"
            direction="vertical"
            ignoreContainerClipping={true}
            isCombineEnabled={false}
          >
            {(listProvided) => (
              <Box {...listProvided.droppableProps} ref={listProvided.innerRef}>
                {activityFlows.map((flow, index) => {
                  const activityFlowKey = getEntityKey(flow);
                  const dataTestid = `builder-activity-flows-flow-${index}`;
                  const hasError = errors[index];
                  const isLastItem = index === activityFlows.length - 1;

                  return (
                    <FlowDraggableItem
                      key={activityFlowKey}
                      flow={flow}
                      index={index}
                      activityFlowKey={activityFlowKey}
                      isDragging={isDragging}
                      isLastItem={isLastItem}
                      hasError={hasError}
                      dataTestid={dataTestid}
                      handleEditActivityFlow={handleEditActivityFlow}
                      handleSetFlowToDeleteData={handleSetFlowToDeleteData}
                      handleDuplicateActivityFlow={handleDuplicateActivityFlow}
                      handleToggleActivityFlowVisibility={handleToggleActivityFlowVisibility}
                      handleAddActivityFlow={handleAddActivityFlow}
                    />
                  );
                })}
                {listProvided.placeholder}
              </Box>
            )}
          </DndDroppable>
          {flowToDeleteData && (
            <DeleteFlowModal
              activityFlowName={flowToDeleteData.name}
              isOpen={!!flowToDeleteData}
              onModalClose={() => setFlowToDeleteData(null)}
              onModalSubmit={handleFlowDelete}
            />
          )}
        </DragDropContext>
      ) : (
        <StyledTitleMedium sx={{ marginTop: theme.spacing(0.4) }}>
          {t('activityFlowIsRequired')}
        </StyledTitleMedium>
      )}
    </BuilderContainer>
  );
};
