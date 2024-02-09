import { useState } from 'react';

import { Box } from '@mui/material';
import { DragDropContext, Draggable, DragDropContextProps } from 'react-beautiful-dnd';
import { useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { DndDroppable, Item, ItemUiType, InsertItem } from 'modules/Builder/components';
import { REACT_HOOK_FORM_KEY_NAME } from 'modules/Builder/consts';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { getNewActivityFlow } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { ActivityFlowFormValues, ActivityFormValues } from 'modules/Builder/types';
import { getUniqueName } from 'modules/Builder/utils';
import { page } from 'resources';
import { BuilderContainer } from 'shared/features';
import { StyledTitleMedium, theme } from 'shared/styles';
import { getEntityKey, pluck } from 'shared/utils';

import { getDuplicatedActivityFlow, getFlowsItemActions } from './ActivityFlow.utils';
import { ActivityFlowHeader } from './ActivityFlowHeader';
import { DeleteFlowModal } from './DeleteFlowModal';

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
  } = useFieldArray<Record<string, ActivityFlowFormValues[]>, string, typeof REACT_HOOK_FORM_KEY_NAME>({
    control,
    name: 'activityFlows',
    keyName: REACT_HOOK_FORM_KEY_NAME,
  });

  const errors = activityFlows?.map((_, index) => !!getFieldState(`activityFlows.${index}`).error);

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
      key: uuidv4(),
      activityKey: getEntityKey(activity),
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
    const name = getUniqueName({
      name: activityFlows[index].name,
      existingNames: pluck(activityFlows, 'name'),
    });

    insertActivityFlow(index + 1, getDuplicatedActivityFlow(activityFlows[index], name));
  };

  const handleToggleActivityFlowVisibility = (index: number) =>
    updateActivityFlow(index, {
      ...activityFlows[index],
      isHidden: !activityFlows[index].isHidden,
    });

  const getActivityFlowVisible = (isHidden: boolean | undefined) => (isHidden === undefined ? false : isHidden);

  const handleSetFlowToDeleteData = (index: number, name: string) => () => setFlowToDeleteData({ index, name });

  const handleDragEnd: DragDropContextProps['onDragEnd'] = ({ source, destination }) => {
    setIsDragging(false);
    if (!destination) return;
    moveActivityFlow(source.index, destination.index);
  };

  return (
    <BuilderContainer
      title={t('activityFlows')}
      Header={ActivityFlowHeader}
      headerProps={{ onAddActivityFlow: handleAddActivityFlow }}
      hasMaxWidth>
      {activityFlows?.length ? (
        <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
          <DndDroppable droppableId="activity-flows-dnd" direction="vertical">
            {(listProvided) => (
              <Box {...listProvided.droppableProps} ref={listProvided.innerRef}>
                {activityFlows.map((flow, index) => {
                  const activityFlowKey = getEntityKey(flow);

                  return (
                    <Draggable key={activityFlowKey} draggableId={activityFlowKey} index={index}>
                      {(itemProvided, snapshot) => {
                        const dataTestid = `builder-activity-flows-flow-${index}`;

                        return (
                          <Box {...itemProvided.draggableProps} ref={itemProvided.innerRef} data-testid={dataTestid}>
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
                              hasError={errors[index]}
                              {...flow}
                              data-testid={dataTestid}
                            />
                            <InsertItem
                              isVisible={index >= 0 && index < activityFlows.length - 1 && !isDragging}
                              onInsert={() => handleAddActivityFlow(index + 1)}
                              data-testid={`${dataTestid}-insert`}
                            />
                          </Box>
                        );
                      }}
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
        <StyledTitleMedium sx={{ marginTop: theme.spacing(0.4) }}>{t('activityFlowIsRequired')}</StyledTitleMedium>
      )}
    </BuilderContainer>
  );
};
