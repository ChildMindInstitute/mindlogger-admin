import { useState, MouseEvent } from 'react';

import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFieldArray } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Draggable, DragDropContextProps } from 'react-beautiful-dnd';

import { Menu } from 'shared/components';
import { BuilderContainer } from 'shared/features';
import { getObjectFromList } from 'shared/utils';
import { Item, ItemUiType, DndDroppable } from 'modules/Builder/components';
import { ActivityFlowItem, AppletFormValues } from 'modules/Builder/types';
import { useRedirectIfNoMatchedActivityFlow, useCustomFormContext } from 'modules/Builder/hooks';
import { REACT_HOOK_FORM_KEY_NAME } from 'modules/Builder/consts';
import { StyledTitleMedium, theme, variables } from 'shared/styles';

import { RemoveFlowActivityModal } from './RemoveFlowActivityModal';
import { getActivityFlowIndex, getFlowBuilderActions, getMenuItems } from './ActivityFlowBuilder.utils';
import { ActivityFlowBuilderHeader } from './ActivityFlowBuilderHeader';
import { GetMenuItemsType } from './ActivityFlowBuilder.types';
import { builderItemClassName } from './ActivityFlowBuilder.const';

export const ActivityFlowBuilder = () => {
  const [flowActivityToDeleteData, setFlowActivityToDeleteData] = useState<{
    index: number;
    name: string;
    activityKey: string;
  } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [flowActivityToUpdateIndex, setFlowActivityToUpdateIndex] = useState<number | null>(null);
  const { t } = useTranslation('app');
  const { control, watch, setValue } = useCustomFormContext();
  const { activityFlowId } = useParams();
  const activityFlows: AppletFormValues['activityFlows'] = watch('activityFlows');
  const activityFlowIndex = getActivityFlowIndex(activityFlows, activityFlowId || '');
  const currentActivityFlow = activityFlows[activityFlowIndex];
  const activityFlowName = `activityFlows.${activityFlowIndex}`;
  const {
    fields: activityFlowItems,
    remove,
    append,
    insert,
    update,
    move,
  } = useFieldArray<Record<string, ActivityFlowItem[]>, string, typeof REACT_HOOK_FORM_KEY_NAME>({
    control,
    name: `${activityFlowName}.items`,
    keyName: REACT_HOOK_FORM_KEY_NAME,
  });
  const activities: AppletFormValues['activities'] = watch('activities');
  const dataTestid = 'builder-activity-flows-builder';

  const handleFlowActivityDuplicate = (index: number) => {
    if (!activityFlowItems) return;
    insert(index + 1, { activityKey: activityFlowItems[index].activityKey, key: uuidv4() });
  };

  const handleFlowActivityToDeleteSet = (index: number, name: string, activityKey: string) => () =>
    setFlowActivityToDeleteData({ index, name, activityKey });

  const removeReportConfigItemValue = () => {
    setValue(`${activityFlowName}.reportIncludedActivityName`, '');
    setValue(`${activityFlowName}.reportIncludedItemName`, '');
  };

  const handleFlowActivityDelete = () => {
    if (!flowActivityToDeleteData) return;
    if (
      currentActivityFlow.reportIncludedActivityName &&
      flowActivityToDeleteData.activityKey === currentActivityFlow.reportIncludedActivityName &&
      activityFlowItems.filter((item) => item.activityKey === currentActivityFlow.reportIncludedActivityName).length ===
        1
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

  const handleFlowActivityToUpdateSet = (event: MouseEvent<HTMLElement>, index: number) => {
    setFlowActivityToUpdateIndex(index);
    let parentElement = event.currentTarget.parentNode as HTMLElement;
    while (parentElement && !parentElement.classList.contains(builderItemClassName)) {
      parentElement = parentElement.parentNode as HTMLElement;
    }
    setAnchorEl(parentElement || null);
  };

  const handleFlowActivityUpdate = (index: number, obj: ActivityFlowItem) => {
    if (
      flowActivityToUpdateIndex !== null &&
      currentActivityFlow.reportIncludedActivityName &&
      activityFlowItems.filter((item) => item.activityKey === currentActivityFlow.reportIncludedActivityName).length ===
        1
    ) {
      removeReportConfigItemValue();
    }
    update(index, obj);
    setFlowActivityToUpdateIndex(null);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleDragEnd: DragDropContextProps['onDragEnd'] = ({ source, destination }) => {
    if (!destination) return;
    move(source.index, destination.index);
  };

  const activitiesIdsObjects = getObjectFromList(activities);

  useRedirectIfNoMatchedActivityFlow();

  return (
    <BuilderContainer
      title={t('activityFlowBuilder')}
      Header={ActivityFlowBuilderHeader}
      headerProps={{
        clearFlowBtnDisabled: activityFlowItems?.length === 0,
        onAddFlowActivity: handleFlowActivityAdd,
        onClearFlow: handleClearFlow,
      }}
      hasMaxWidth
    >
      {activityFlowItems?.length ? (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <DndDroppable droppableId="activity-flow-builder-dnd" direction="vertical">
              {(listProvided) => (
                <Box {...listProvided.droppableProps} ref={listProvided.innerRef}>
                  {activityFlowItems.map((item, index) => {
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
                                  replaceItemActionActive: !!anchorEl && flowActivityToUpdateIndex === index,
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
                  })}
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
        <StyledTitleMedium sx={{ mt: theme.spacing(0.4), color: variables.palette.on_surface_variant }}>
          {t('activityFlowIsRequired')}
        </StyledTitleMedium>
      )}
    </BuilderContainer>
  );
};
