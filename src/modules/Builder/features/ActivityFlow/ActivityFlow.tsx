import { useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Draggable, DragDropContextProps } from 'react-beautiful-dnd';
import { Box } from '@mui/material';

import { StyledTitleMedium, theme } from 'shared/styles';
import { BuilderContainer } from 'shared/features';
import { useBreadcrumbs } from 'shared/hooks';
import { DndDroppable, Item, ItemUiType, InsertItem } from 'modules/Builder/components';
import { page } from 'resources';
import { getNewActivityFlow } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { ActivityFlowFormValues, AppletFormValues } from 'modules/Builder/pages/BuilderApplet';

import { DeleteFlowModal } from './DeleteFlowModal';
import { getFlowsItemActions } from './ActivityFlow.utils';
import { ActivityFlowHeader } from './ActivityFlowHeader';

export const ActivityFlow = () => {
  const [, setDuplicateIndexes] = useState<Record<string, number> | null>(null);
  const [flowToDeleteData, setFlowToDeleteData] = useState<{
    index: number;
    name: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useTranslation('app');
  const { watch, control, getFieldState } = useFormContext<AppletFormValues>();
  const { appletId } = useParams();
  const navigate = useNavigate();

  const activityFlows: AppletFormValues['activityFlows'] = watch('activityFlows');
  const activities: AppletFormValues['activities'] = watch('activities');

  const {
    remove: removeActivityFlow,
    append: appendActivityFlow,
    insert: insertActivityFlow,
    update: updateActivityFlow,
    move: moveActivityFlow,
  } = useFieldArray({
    control,
    name: 'activityFlows',
  });

  const errors = activityFlows?.reduce(
    (err: Record<string, boolean>, _: ActivityFlowFormValues, index: number) => ({
      ...err,
      [`activityFlows.${index}`]: !!getFieldState(`activityFlows.${index}`).error,
    }),
    {},
  );

  const handleFlowDelete = () => {
    if (!flowToDeleteData) return;

    removeActivityFlow(flowToDeleteData.index);
    setFlowToDeleteData(null);
  };

  const handleEditActivityFlow = (activityFlowId: string) =>
    navigate(
      generatePath(page.builderAppletActivityFlowItem, {
        appletId,
        activityFlowId,
      }),
    );

  const handleAddActivityFlow = (positionToAdd?: number) => {
    const flowItems = activities.map((activity) => ({
      // TODO: discuss with back-end to possibly change keys to ids and handle ids on back-end side
      key: uuidv4(),
      activityKey: activity.id || activity.key || '',
    }));
    const newActivityFlow = { ...getNewActivityFlow(), items: flowItems };

    if (positionToAdd) {
      insertActivityFlow(positionToAdd, newActivityFlow);
    } else {
      appendActivityFlow(newActivityFlow);
    }
    handleEditActivityFlow(newActivityFlow.key);
  };

  const handleDuplicateActivityFlow = (index: number) => {
    const duplicatedItem = activityFlows[index];
    setDuplicateIndexes((prevState) => {
      const duplicatedItemId = duplicatedItem.id || '';
      const insertedNumber =
        prevState && prevState[duplicatedItemId] ? prevState[duplicatedItemId] + 1 : 1;

      insertActivityFlow(index + 1, {
        ...activityFlows[index],
        id: undefined,
        key: uuidv4(),
        name: `${activityFlows[index].name} (${insertedNumber})`,
      });

      return {
        ...prevState,
        [duplicatedItemId]: insertedNumber,
      };
    });
  };

  const handleToggleActivityFlowVisibility = (index: number) =>
    updateActivityFlow(index, {
      ...activityFlows[index],
      isHidden: !activityFlows[index].isHidden,
    });

  const getActivityFlowVisible = (isHidden: boolean | undefined) =>
    isHidden === undefined ? false : isHidden;

  const handleSetFlowToDeleteData = (index: number, name: string) => () =>
    setFlowToDeleteData({ index, name });

  const handleDragEnd: DragDropContextProps['onDragEnd'] = ({ source, destination }) => {
    setIsDragging(false);
    if (!destination) return;
    moveActivityFlow(source.index, destination.index);
  };

  useBreadcrumbs([
    {
      icon: 'flow',
      label: t('activityFlow'),
    },
  ]);

  return (
    <BuilderContainer
      title={t('activityFlow')}
      Header={ActivityFlowHeader}
      headerProps={{ onAddActivityFlow: handleAddActivityFlow }}
    >
      {activityFlows?.length ? (
        <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
          <DndDroppable droppableId="activity-flows-dnd" direction="vertical">
            {(listProvided) => (
              <Box {...listProvided.droppableProps} ref={listProvided.innerRef}>
                {activityFlows.map((flow, index) => {
                  const activityFlowKey = flow.id ?? (flow.key || '');

                  return (
                    <Draggable key={activityFlowKey} draggableId={activityFlowKey} index={index}>
                      {(itemProvided, snapshot) => (
                        <Box {...itemProvided.draggableProps} ref={itemProvided.innerRef}>
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
                              })
                            }
                            isInactive={flow.isHidden}
                            hasStaticActions={flow.isHidden}
                            uiType={ItemUiType.Flow}
                            hasError={errors[`activityFlows.${index}`]}
                            {...flow}
                          />
                          <InsertItem
                            isVisible={
                              index >= 0 && index < activityFlows.length - 1 && !isDragging
                            }
                            onInsert={() => handleAddActivityFlow(index + 1)}
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
