import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams, generatePath } from 'react-router-dom';
import { DragDropContext, Draggable, DragDropContextProps } from 'react-beautiful-dnd';
import { Box } from '@mui/material';

import { StyledTitleMedium, StyledFlexColumn, theme } from 'shared/styles';
import { page } from 'resources';
import { useBreadcrumbs } from 'shared/hooks';
import { ActivityFormValues, AppletFormValues } from 'modules/Builder/types';
import { Item, ItemUiType, InsertItem, DndDroppable } from 'modules/Builder/components';
import {
  getNewActivity,
  getNewPerformanceTask,
} from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { BuilderContainer } from 'shared/features';

import { DeleteActivityModal } from './DeleteActivityModal';
import { ActivitiesHeader } from './ActivitiesHeader';
import { getActions, getActivityKey } from './Activities.utils';
import { ActivityAddProps } from './Activities.types';

export const Activities = () => {
  const { t } = useTranslation('app');
  const { control, watch, getFieldState, setValue } = useFormContext();
  const navigate = useNavigate();
  const { appletId } = useParams();
  const [activityToDelete, setActivityToDelete] = useState<string>('');
  const [, setDuplicateIndexes] = useState<Record<string, number>>({});
  const [isDragging, setIsDragging] = useState(false);

  const {
    append: appendActivity,
    insert: insertActivity,
    remove: removeActivity,
    update: updateActivity,
    move: moveActivity,
  } = useFieldArray({
    control,
    name: 'activities',
  });

  const activities: ActivityFormValues[] = watch('activities');
  const activityFlows: AppletFormValues['activityFlows'] = watch('activityFlows');

  const errors = activities?.reduce(
    (err: Record<string, boolean>, _: ActivityFormValues, index: number) => ({
      ...err,
      [`activities[${index}]`]: !!getFieldState(`activities[${index}]`).error,
    }),
    {},
  );

  useBreadcrumbs([
    {
      icon: 'checklist-filled',
      label: t('activities'),
    },
  ]);

  const navigateToActivity = (activityId?: string) =>
    activityId &&
    navigate(
      generatePath(page.builderAppletActivityAbout, {
        appletId,
        activityId,
      }),
    );
  const navigateToFlanker = (activityId?: string) =>
    activityId &&
    navigate(
      generatePath(page.builderAppletFlanker, {
        appletId,
        activityId,
      }),
    );
  const handleModalClose = () => setActivityToDelete('');
  const handleActivityAdd = (props: ActivityAddProps) => {
    const { index, performanceTaskName, performanceTaskDesc, isNavigationBlocked, isFlankerItem } =
      props || {};
    const newActivity =
      performanceTaskName && performanceTaskDesc
        ? getNewPerformanceTask({
            name: performanceTaskName,
            description: performanceTaskDesc,
            isFlankerItem,
          })
        : getNewActivity();

    typeof index === 'number' ? insertActivity(index, newActivity) : appendActivity(newActivity);

    if (isNavigationBlocked) return;
    if (newActivity.isFlankerItem) {
      return navigateToFlanker(newActivity.key);
    }

    return navigateToActivity(newActivity.key);
  };

  const handleActivityRemove = (index: number, activityKey: string) => {
    const newActivityFlows = activityFlows.reduce(
      (acc: AppletFormValues['activityFlows'], flow) => {
        const items = flow.items?.filter((item) => item.activityKey !== activityKey);
        if (items && items.length > 0) {
          acc.push({ ...flow, items });
        }

        return acc;
      },
      [],
    );

    removeActivity(index);
    setValue('activityFlows', newActivityFlows);
  };

  const handleDuplicateActivity = (index: number, isPerformanceTask: boolean) => {
    const activityToDuplicate = activities[index];
    setDuplicateIndexes((prevState) => {
      const numberToInsert = (prevState[getActivityKey(activityToDuplicate)] || 0) + 1;

      const newActivity = isPerformanceTask
        ? getNewPerformanceTask({
            performanceTask: activityToDuplicate as ActivityFormValues,
          })
        : getNewActivity(activityToDuplicate as ActivityFormValues);

      insertActivity(index + 1, {
        ...newActivity,
        name: `${activityToDuplicate.name} (${numberToInsert})`,
      });

      return {
        ...prevState,
        [getActivityKey(activityToDuplicate)]: numberToInsert,
      };
    });
  };

  const handleEditActivity = (index: number) => {
    const activityToEdit = activities[index];
    const activityKey = getActivityKey(activityToEdit);
    if (activityToEdit.isFlankerItem) {
      return navigateToFlanker(activityKey);
    }

    return navigateToActivity(activityKey);
  };

  const handleActivityVisibilityChange = (index: number) => {
    const activityToChangeVisibility = activities[index];
    updateActivity(index, {
      ...activityToChangeVisibility,
      isHidden: !activityToChangeVisibility.isHidden,
    });
  };

  const handleDragEnd: DragDropContextProps['onDragEnd'] = ({ source, destination }) => {
    setIsDragging(false);
    if (!destination) return;
    moveActivity(source.index, destination.index);
  };

  return (
    <BuilderContainer
      title={t('activities')}
      Header={ActivitiesHeader}
      headerProps={{ onAddActivity: handleActivityAdd }}
    >
      <StyledFlexColumn>
        {activities?.length ? (
          <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
            <DndDroppable droppableId="activities-dnd" direction="vertical">
              {(listProvided) => (
                <Box {...listProvided.droppableProps} ref={listProvided.innerRef}>
                  {activities.map((activity: ActivityFormValues, index: number) => {
                    const activityKey = getActivityKey(activity);
                    const isPerformanceTask = activity?.isPerformanceTask || false;
                    const activityName = activity.name;
                    const isEditVisible = !isPerformanceTask || !!activity.isFlankerItem;
                    const hasError = errors[`activities[${index}]`];

                    return (
                      <Fragment key={`activity-${activityKey}`}>
                        <Draggable draggableId={activityKey} index={index}>
                          {(itemProvided, snapshot) => (
                            <Box {...itemProvided.draggableProps} ref={itemProvided.innerRef}>
                              <Item
                                {...activity}
                                onItemClick={() => handleEditActivity(index)}
                                dragHandleProps={itemProvided.dragHandleProps}
                                isDragging={snapshot.isDragging}
                                img={activity.image}
                                isInactive={activity.isHidden}
                                hasStaticActions={activity.isHidden}
                                uiType={ItemUiType.Activity}
                                getActions={() =>
                                  getActions({
                                    key: activityKey,
                                    isActivityHidden: activity.isHidden,
                                    onEdit: () => handleEditActivity(index),
                                    onDuplicate: () =>
                                      handleDuplicateActivity(index, isPerformanceTask),
                                    onRemove: () => setActivityToDelete(activityKey),
                                    onVisibilityChange: () => handleActivityVisibilityChange(index),
                                    isEditVisible,
                                  })
                                }
                                hasError={hasError}
                                count={activity.items?.length}
                              />
                              <InsertItem
                                isVisible={
                                  index >= 0 && index < activities.length - 1 && !isDragging
                                }
                                onInsert={() => handleActivityAdd({ index: index + 1 })}
                              />
                            </Box>
                          )}
                        </Draggable>
                        <DeleteActivityModal
                          activityName={activityName}
                          isOpen={activityToDelete === activityKey}
                          onModalClose={handleModalClose}
                          onModalSubmit={() => handleActivityRemove(index, activityKey)}
                        />
                      </Fragment>
                    );
                  })}
                  {listProvided.placeholder}
                </Box>
              )}
            </DndDroppable>
          </DragDropContext>
        ) : (
          <StyledTitleMedium sx={{ marginTop: theme.spacing(0.4) }}>
            {t('activityIsRequired')}
          </StyledTitleMedium>
        )}
      </StyledFlexColumn>
    </BuilderContainer>
  );
};
