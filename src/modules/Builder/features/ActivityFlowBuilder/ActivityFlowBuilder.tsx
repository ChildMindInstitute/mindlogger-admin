import { useEffect, useState, MouseEvent } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Draggable, DragDropContextProps } from 'react-beautiful-dnd';

import { Menu } from 'shared/components';
import { BuilderContainer } from 'shared/features';
import { useBreadcrumbs } from 'shared/hooks';
import { Item, ItemUiType, DndDroppable } from 'modules/Builder/components';
import {
  ActivityFlowFormValues,
  ActivityFlowItem,
  AppletFormValues,
} from 'modules/Builder/pages/BuilderApplet/BuilderApplet.types';
import { page } from 'resources';

import { RemoveFlowActivityModal } from './RemoveFlowActivityModal';
import { getFlowBuilderActions, getMenuItems } from './ActivityFlowBuilder.utils';
import { ActivityFlowBuilderHeader } from './ActivityFlowBuilderHeader';
import { GetMenuItemsType } from './ActivityFlowBuilder.types';

export const ActivityFlowBuilder = () => {
  const [flowActivityToDeleteData, setFlowActivityToDeleteData] = useState<{
    index: number;
    name: string;
  } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [indexToUpdate, setIndexToUpdate] = useState<null | number>(null);
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { control, watch } = useFormContext();
  const { appletId, activityFlowId } = useParams();
  const activityFlows: AppletFormValues['activityFlows'] = watch('activityFlows');
  const activityFlowIndex = activityFlows.findIndex((flow) => flow.id === activityFlowId);
  const { remove, append, insert, update, move } = useFieldArray({
    control,
    name: `activityFlows.${activityFlowIndex}.items`,
  });
  const activityFlowItems: ActivityFlowFormValues['items'] = watch(
    `activityFlows.${activityFlowIndex}.items`,
  );
  const activities: AppletFormValues['activities'] = watch('activities');

  const handleFlowActivityDuplicate = (index: number) => {
    if (!activityFlowItems) return;
    insert(index + 1, { activityId: activityFlowItems[index].activityId, id: uuidv4() });
  };

  const handleFlowActivityToDeleteSet = (index: number, name: string) => () =>
    setFlowActivityToDeleteData({ index, name });

  const handleFlowActivityDelete = () => {
    if (!flowActivityToDeleteData) return;

    remove(flowActivityToDeleteData.index);
    setFlowActivityToDeleteData(null);
  };

  const handleFlowActivityAdd = (activityKey: string) =>
    append({ id: uuidv4(), activityId: activityKey });

  const handleFlowActivityToUpdateSet = (event: MouseEvent<HTMLElement>, index: number) => {
    setIndexToUpdate(index);
    let parentElement = event.currentTarget.parentNode as HTMLElement;
    while (parentElement && !parentElement.classList.contains('builder-item')) {
      parentElement = parentElement.parentNode as HTMLElement;
    }
    setAnchorEl(parentElement || null);
  };

  const handleFlowActivityUpdate = (index: number, obj: ActivityFlowItem) => {
    update(index, obj);
    setIndexToUpdate(null);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleDragEnd: DragDropContextProps['onDragEnd'] = ({ source, destination }) => {
    if (!destination) return;
    move(source.index, destination.index);
  };

  useBreadcrumbs([
    {
      icon: 'flow',
      label: t('activityFlowBuilder'),
    },
  ]);

  useEffect(() => {
    if (activityFlowIndex !== -1) return;
    navigate(
      generatePath(page.builderAppletActivityFlow, {
        appletId,
      }),
    );
  }, [activityFlowIndex]);

  return (
    <BuilderContainer
      title={t('activityFlowBuilder')}
      Header={ActivityFlowBuilderHeader}
      headerProps={{
        clearFlowBtnDisabled: activityFlowItems?.length === 0,
        onAddFlowActivity: handleFlowActivityAdd,
        onClearFlow: remove,
      }}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <DndDroppable droppableId="activity-flow-builder-dnd" direction="vertical">
          {(listProvided) => (
            <Box {...listProvided.droppableProps} {...{ ref: listProvided.innerRef }}>
              {activityFlowItems?.map((item, index) => {
                const activityKey = item.activityId;
                const currentActivity = activities?.find(
                  (activity) => (activity.id || activity.key) === activityKey,
                );
                const activityName = currentActivity?.name;
                const activityDescription = currentActivity?.description;

                return (
                  <Draggable key={item.id} draggableId={item.id || ''} index={index}>
                    {(itemProvided, snapshot) => (
                      <Box
                        className="builder-item"
                        {...itemProvided.draggableProps}
                        {...{ ref: itemProvided.innerRef }}
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
                              removeItem: handleFlowActivityToDeleteSet(index, activityName || ''),
                              replaceItemActionActive: !!anchorEl && indexToUpdate === index,
                            })
                          }
                          uiType={ItemUiType.FlowBuilder}
                          name={activityName || ''}
                          description={activityDescription || ''}
                          visibleByDefault={!!anchorEl && indexToUpdate === index}
                          {...item}
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
            index: indexToUpdate ?? undefined,
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
    </BuilderContainer>
  );
};
