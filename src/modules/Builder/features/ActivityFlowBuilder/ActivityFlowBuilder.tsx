import { Box } from '@mui/material';
import React, { CSSProperties, MouseEvent, useCallback, useMemo, useRef, useState } from 'react';
import { DragDropContext, DragDropContextProps, Draggable } from 'react-beautiful-dnd';
import { useFieldArray, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import { v4 as uuidv4 } from 'uuid';

import { DndDroppable, Item, ItemUiType } from 'modules/Builder/components';
import { REACT_HOOK_FORM_KEY_NAME } from 'modules/Builder/consts';
import { useCustomFormContext, useRedirectIfNoMatchedActivityFlow } from 'modules/Builder/hooks';
import {
  ActivityFlowFormValues,
  ActivityFlowItem,
  ActivityFormValues,
} from 'modules/Builder/types';
import { Menu } from 'shared/components';
import { BuilderContainer } from 'shared/features';
import { StyledTitleMedium, theme, variables } from 'shared/styles';

import { builderItemClassName } from './ActivityFlowBuilder.const';
import { GetMenuItemsType } from './ActivityFlowBuilder.types';
import {
  getActivityFlowIndex,
  getFlowBuilderActions,
  getMenuItems,
  getNonReviewableActivities,
} from './ActivityFlowBuilder.utils';
import { ActivityFlowBuilderHeader } from './ActivityFlowBuilderHeader';
import { RemoveFlowActivityModal } from './RemoveFlowActivityModal';

// Memoized list item component for better performance
interface VirtualizedListItemProps {
  index: number;
  style: CSSProperties;
  data: {
    activityFlowItems: ActivityFlowItem[];
    activitiesIdsObjects: Record<string, ActivityFormValues>;
    dataTestid: string;
    anchorEl: HTMLElement | null;
    flowActivityToUpdateIndex: number | null;
    handleFlowActivityToUpdateSet: (event: MouseEvent<HTMLElement>, index: number) => void;
    handleFlowActivityDuplicate: (index: number) => void;
    handleFlowActivityToDeleteSet: (index: number, name: string, activityKey: string) => () => void;
  };
}

const VirtualizedListItem = React.memo<VirtualizedListItemProps>(({ index, style, data }) => {
  const item = data.activityFlowItems[index];
  const key = item.id || item.key;
  const currentActivity = data.activitiesIdsObjects[item.activityKey];
  const activityName = currentActivity?.name;
  const activityDescription = currentActivity?.description;
  const itemDataTestid = `${data.dataTestid}-flow-${index}`;

  // Optimized style calculation
  const getItemStyle = useCallback(
    (isDragging: boolean, draggableStyle: any) => ({
      ...style,
      ...draggableStyle,
      marginBottom: '16px',
      userSelect: 'none',
      ...(isDragging && {
        zIndex: 5000,
        boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
        opacity: 0.9,
      }),
    }),
    [style],
  );

  return (
    <Draggable key={key} draggableId={key || ''} index={index}>
      {(itemProvided, snapshot) => (
        <Box
          className={builderItemClassName}
          ref={itemProvided.innerRef}
          {...itemProvided.draggableProps}
          data-testid={itemDataTestid}
          style={getItemStyle(snapshot.isDragging, itemProvided.draggableProps.style)}
        >
          <Item
            dragHandleProps={itemProvided.dragHandleProps}
            isDragging={snapshot.isDragging}
            index={index + 1}
            total={data.activityFlowItems.length}
            getActions={() =>
              getFlowBuilderActions({
                index,
                replaceItem: data.handleFlowActivityToUpdateSet,
                duplicateItem: data.handleFlowActivityDuplicate,
                removeItem: data.handleFlowActivityToDeleteSet(
                  index,
                  activityName || '',
                  item.activityKey,
                ),
                replaceItemActionActive:
                  !!data.anchorEl && data.flowActivityToUpdateIndex === index,
                'data-testid': itemDataTestid,
              })
            }
            uiType={ItemUiType.FlowBuilder}
            name={activityName || ''}
            description={activityDescription || ''}
            visibleByDefault={!!data.anchorEl && data.flowActivityToUpdateIndex === index}
            {...item}
            data-testid={itemDataTestid}
          />
        </Box>
      )}
    </Draggable>
  );
});

VirtualizedListItem.displayName = 'VirtualizedListItem';

export const ActivityFlowBuilder = () => {
  const [flowActivityToDeleteData, setFlowActivityToDeleteData] = useState<{
    index: number;
    name: string;
    activityKey: string;
  } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const stableAnchorRef = useRef<HTMLDivElement | null>(null);
  const [flowActivityToUpdateIndex, setFlowActivityToUpdateIndex] = useState<number | null>(null);
  const { t } = useTranslation('app');
  const { control, setValue } = useCustomFormContext();
  const { activityFlowId } = useParams();

  const formActivities: ActivityFormValues[] = useWatch({ control, name: 'activities' });
  const activityFlows: ActivityFlowFormValues[] = useWatch({ control, name: 'activityFlows' });

  const activityFlowIndex = getActivityFlowIndex(activityFlows, activityFlowId || '');
  const currentActivityFlow = activityFlows[activityFlowIndex];
  const activityFlowName = `activityFlows.${activityFlowIndex}`;
  const { remove, append, insert, update, move } = useFieldArray<
    Record<string, ActivityFlowItem[]>,
    string,
    typeof REACT_HOOK_FORM_KEY_NAME
  >({
    control,
    name: `${activityFlowName}.items`,
    keyName: REACT_HOOK_FORM_KEY_NAME,
  });
  const activityFlowItems = currentActivityFlow?.items;

  // remove Reviewer Assessment Activity from Activities list
  const { activities, activitiesIdsObjects } = useMemo(
    () => getNonReviewableActivities(formActivities),
    [formActivities],
  );
  const dataTestid = 'builder-activity-flows-builder';

  const handleFlowActivityDuplicate = useCallback(
    (index: number) => {
      if (!activityFlowItems) return;
      insert(index + 1, { activityKey: activityFlowItems[index].activityKey, key: uuidv4() });
    },
    [activityFlowItems, insert],
  );

  const handleFlowActivityToDeleteSet = useCallback(
    (index: number, name: string, activityKey: string) => () =>
      setFlowActivityToDeleteData({ index, name, activityKey }),
    [],
  );

  const removeReportConfigItemValue = () => {
    setValue(`${activityFlowName}.reportIncludedActivityName`, '');
    setValue(`${activityFlowName}.reportIncludedItemName`, '');
  };

  const handleFlowActivityDelete = () => {
    if (!flowActivityToDeleteData || !activityFlowItems) return;
    if (
      currentActivityFlow.reportIncludedActivityName &&
      flowActivityToDeleteData.activityKey === currentActivityFlow.reportIncludedActivityName &&
      activityFlowItems.filter(
        (item) => item.activityKey === currentActivityFlow.reportIncludedActivityName,
      ).length === 1
    ) {
      removeReportConfigItemValue();
    }
    remove(flowActivityToDeleteData.index);
    setFlowActivityToDeleteData(null);
  };

  const handleClearFlow = () => {
    remove();
    removeReportConfigItemValue();
  };

  const handleFlowActivityAdd = (activityKey: string) => append({ key: uuidv4(), activityKey });

  const handleFlowActivityToUpdateSet = useCallback(
    (event: MouseEvent<HTMLElement>, index: number) => {
      setFlowActivityToUpdateIndex(index);

      if (stableAnchorRef.current) {
        const rect = event.currentTarget.getBoundingClientRect();
        stableAnchorRef.current.style.position = 'absolute';
        stableAnchorRef.current.style.top = `${rect.top}px`;
        stableAnchorRef.current.style.left = `${rect.left}px`;
        stableAnchorRef.current.style.width = `${rect.width}px`;
        stableAnchorRef.current.style.height = `${rect.height}px`;
        setAnchorEl(stableAnchorRef.current);
      }
    },
    [],
  );

  const handleFlowActivityUpdate = (index: number, obj: ActivityFlowItem) => {
    if (!activityFlowItems) return;
    if (
      flowActivityToUpdateIndex !== null &&
      currentActivityFlow.reportIncludedActivityName &&
      activityFlowItems.filter(
        (item) => item.activityKey === currentActivityFlow.reportIncludedActivityName,
      ).length === 1
    ) {
      removeReportConfigItemValue();
    }
    update(index, obj);
    setFlowActivityToUpdateIndex(null);
  };

  const handleMenuClose = useCallback(() => setAnchorEl(null), []);

  const handleDragEnd: DragDropContextProps['onDragEnd'] = useCallback(
    ({ source, destination }) => {
      if (!destination) return;
      move(source.index, destination.index);
    },
    [move],
  );

  useRedirectIfNoMatchedActivityFlow();

  return (
    <BuilderContainer
      title={t('activityFlowBuilder')}
      Header={ActivityFlowBuilderHeader}
      headerProps={{
        activities,
        clearFlowBtnDisabled: activityFlowItems?.length === 0,
        onAddFlowActivity: handleFlowActivityAdd,
        onClearFlow: handleClearFlow,
      }}
      hasMaxWidth
    >
      <div ref={stableAnchorRef} style={{ position: 'absolute', pointerEvents: 'none' }} />

      {activityFlowItems?.length ? (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <DndDroppable
              droppableId="activity-flow-builder-dnd"
              direction="vertical"
              mode="virtual"
              ignoreContainerClipping={true}
              isCombineEnabled={false}
              renderClone={(provided, snapshot, rubric) => (
                <Box
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  style={{
                    ...provided.draggableProps.style,
                    zIndex: 9999,
                  }}
                >
                  <Item
                    uiType={ItemUiType.FlowBuilder}
                    name={
                      activitiesIdsObjects[activityFlowItems[rubric.source.index]?.activityKey]
                        ?.name || ''
                    }
                    description={
                      activitiesIdsObjects[activityFlowItems[rubric.source.index]?.activityKey]
                        ?.description || ''
                    }
                    isDragging={snapshot.isDragging}
                    getActions={() => []}
                  />
                </Box>
              )}
            >
              {(listProvided) => (
                <Box
                  {...listProvided.droppableProps}
                  ref={listProvided.innerRef}
                  sx={{ position: 'relative', minHeight: '200px' }}
                >
                  {activityFlowItems.length > 10 ? (
                    <List
                      height={Math.min(600, window.innerHeight - 200)}
                      width="100%"
                      itemCount={activityFlowItems.length}
                      itemSize={98}
                      overscanCount={3}
                      itemData={{
                        activityFlowItems,
                        activitiesIdsObjects,
                        dataTestid,
                        anchorEl,
                        flowActivityToUpdateIndex,
                        handleFlowActivityToUpdateSet,
                        handleFlowActivityDuplicate,
                        handleFlowActivityToDeleteSet,
                      }}
                    >
                      {VirtualizedListItem}
                    </List>
                  ) : (
                    activityFlowItems.map((item, index) => {
                      const key = item.id || item.key;
                      const currentActivity = activitiesIdsObjects[item.activityKey];
                      const activityName = currentActivity?.name;
                      const activityDescription = currentActivity?.description;
                      const itemDataTestid = `${dataTestid}-flow-${index}`;

                      return (
                        <Draggable key={key} draggableId={key || ''} index={index}>
                          {(itemProvided, snapshot) => (
                            <Box
                              className={builderItemClassName}
                              ref={itemProvided.innerRef}
                              {...itemProvided.draggableProps}
                              data-testid={itemDataTestid}
                              style={{
                                ...itemProvided.draggableProps.style,
                                marginBottom: '16px',
                                userSelect: 'none',
                                ...(snapshot.isDragging && {
                                  zIndex: 5000,
                                  boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                                  opacity: 0.9,
                                }),
                              }}
                            >
                              <Item
                                dragHandleProps={itemProvided.dragHandleProps}
                                isDragging={snapshot.isDragging}
                                index={index + 1}
                                total={activityFlowItems.length}
                                getActions={() =>
                                  getFlowBuilderActions({
                                    index,
                                    replaceItem: handleFlowActivityToUpdateSet,
                                    duplicateItem: handleFlowActivityDuplicate,
                                    removeItem: handleFlowActivityToDeleteSet(
                                      index,
                                      activityName || '',
                                      item.activityKey,
                                    ),
                                    replaceItemActionActive:
                                      !!anchorEl && flowActivityToUpdateIndex === index,
                                    'data-testid': itemDataTestid,
                                  })
                                }
                                uiType={ItemUiType.FlowBuilder}
                                name={activityName || ''}
                                description={activityDescription || ''}
                                visibleByDefault={!!anchorEl && flowActivityToUpdateIndex === index}
                                {...item}
                                data-testid={itemDataTestid}
                              />
                            </Box>
                          )}
                        </Draggable>
                      );
                    })
                  )}
                  {listProvided.placeholder}
                </Box>
              )}
            </DndDroppable>
          </DragDropContext>
          {flowActivityToDeleteData && (
            <RemoveFlowActivityModal
              activityName={flowActivityToDeleteData.name}
              isOpen={!!flowActivityToDeleteData}
              onModalClose={() => setFlowActivityToDeleteData(null)}
              onModalSubmit={handleFlowActivityDelete}
            />
          )}
          {anchorEl && (
            <Menu
              anchorEl={anchorEl}
              onClose={handleMenuClose}
              menuItems={getMenuItems({
                type: GetMenuItemsType.ChangeActivity,
                index: flowActivityToUpdateIndex ?? undefined,
                onMenuClose: () => setAnchorEl(null),
                activities,
                onUpdateFlowActivity: handleFlowActivityUpdate,
              })}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 30,
                horizontal: 'right',
              }}
              width="44rem"
            />
          )}
        </>
      ) : (
        <StyledTitleMedium
          sx={{ mt: theme.spacing(0.4), color: variables.palette.on_surface_variant }}
        >
          {t('activityFlowIsRequired')}
        </StyledTitleMedium>
      )}
    </BuilderContainer>
  );
};
