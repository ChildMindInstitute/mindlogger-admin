import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useWatch } from 'react-hook-form';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, DragDropContextProps, Draggable } from 'react-beautiful-dnd';
import { Box } from '@mui/material';

import { StyledTitleMedium, theme } from 'shared/styles';
import { page } from 'resources';
import { ActivityFormValues, AppletFormValues, GetNewPerformanceTask } from 'modules/Builder/types';
import { DndDroppable, InsertItem, Item, ItemUiType } from 'modules/Builder/components';
import { REACT_HOOK_FORM_KEY_NAME } from 'modules/Builder/consts';
import {
  getNewActivity,
  getNewPerformanceTask,
} from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { BuilderContainer } from 'shared/features';
import { PerfTaskType } from 'shared/consts';
import { pluck, Mixpanel } from 'shared/utils';
import { getUniqueName, getUpdatedActivityFlows } from 'modules/Builder/utils';
import { useCustomFormContext } from 'modules/Builder/hooks';

import { DeleteActivityModal } from './DeleteActivityModal';
import { ActivitiesHeader } from './ActivitiesHeader';
import { getActions, getActivityKey, getPerformanceTaskPath } from './Activities.utils';
import { ActivityAddProps, EditablePerformanceTasksType } from './Activities.types';
import { EditablePerformanceTasks } from './Activities.const';

export const Activities = () => {
  const { t } = useTranslation('app');
  const { control, getFieldState, setValue, clearErrors } = useCustomFormContext();
  const navigate = useNavigate();
  const { appletId } = useParams();
  const [activityToDelete, setActivityToDelete] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const {
    fields: activities,
    append: appendActivity,
    insert: insertActivity,
    remove: removeActivity,
    update: updateActivity,
    move: moveActivity,
  } = useFieldArray<Record<string, ActivityFormValues[]>, string, typeof REACT_HOOK_FORM_KEY_NAME>({
    control,
    name: 'activities',
    keyName: REACT_HOOK_FORM_KEY_NAME,
  });

  const activityNames = pluck(activities, 'name');
  const activityFlows: AppletFormValues['activityFlows'] = useWatch({ name: 'activityFlows' });
  const errors = activities?.map((_, index) => !!getFieldState(`activities.${index}`).error);

  const navigateToActivity = (activityId?: string) =>
    activityId &&
    navigate(
      generatePath(page.builderAppletActivityAbout, {
        appletId,
        activityId,
      }),
    );
  const navigateToPerformanceTask = (activityId?: string, performanceTasksType?: PerfTaskType) =>
    activityId &&
    appletId &&
    performanceTasksType &&
    navigate(
      generatePath(
        getPerformanceTaskPath(performanceTasksType as unknown as EditablePerformanceTasksType),
        {
          appletId,
          activityId,
        },
      ),
    );
  const handleModalClose = () => setActivityToDelete('');
  const handleActivityAdd = (props: ActivityAddProps) => {
    Mixpanel.track('Add Activity click');
    const {
      index,
      performanceTaskName,
      performanceTaskDesc,
      isNavigationBlocked,
      performanceTaskType,
    } = props || {};

    const newActivityName =
      performanceTaskName && performanceTaskDesc && performanceTaskType
        ? performanceTaskName
        : t('newActivity');

    const name = getUniqueName({ name: newActivityName, existingNames: activityNames });

    const newActivity =
      performanceTaskName && performanceTaskDesc && performanceTaskType
        ? (getNewPerformanceTask({
            name,
            description: performanceTaskDesc,
            performanceTaskType,
          }) as ActivityFormValues)
        : getNewActivity({ name });

    typeof index === 'number' ? insertActivity(index, newActivity) : appendActivity(newActivity);

    if (isNavigationBlocked) return;
    if (activities?.length === 0) {
      clearErrors('activities');
    }
    if (newActivity.isPerformanceTask && performanceTaskType) {
      return navigateToPerformanceTask(newActivity.key, performanceTaskType);
    }

    return navigateToActivity(newActivity.key);
  };

  const handleActivityRemove = (index: number, activityKey: string) => {
    const newActivityFlows = getUpdatedActivityFlows(activityFlows, activityKey);
    removeActivity(index);
    setValue('activityFlows', newActivityFlows);
  };

  const handleDuplicateActivity = (index: number, isPerformanceTask: boolean) => {
    const activityToDuplicate = activities[index];
    const name = getUniqueName({ name: activityToDuplicate.name, existingNames: activityNames });

    const newActivity = isPerformanceTask
      ? getNewPerformanceTask({
          name,
          description: activityToDuplicate.description,
          performanceTask: activityToDuplicate as GetNewPerformanceTask['performanceTask'],
        })
      : getNewActivity({ activity: activityToDuplicate });

    insertActivity(index + 1, {
      ...(newActivity as ActivityFormValues),
      name,
    });
  };

  const handleEditActivity = (index: number) => {
    Mixpanel.track('Activity edit click');
    const activityToEdit = activities[index];
    const activityKey = getActivityKey(activityToEdit);
    if (activityToEdit.isPerformanceTask && activityToEdit.performanceTaskType) {
      return navigateToPerformanceTask(activityKey, activityToEdit.performanceTaskType);
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
      hasMaxWidth
    >
      {activities?.length ? (
        <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
          <DndDroppable droppableId="activities-dnd" direction="vertical">
            {(listProvided) => (
              <Box {...listProvided.droppableProps} ref={listProvided.innerRef}>
                {activities.map((activity: ActivityFormValues, index: number) => {
                  const activityKey = getActivityKey(activity);
                  const isPerformanceTask = activity?.isPerformanceTask || false;
                  const activityName = activity.name;
                  const isEditVisible =
                    !isPerformanceTask ||
                    EditablePerformanceTasks.includes(activity.performanceTaskType || '');
                  const hasError = errors[index];
                  const dataTestid = `builder-activities-activity-${index}`;

                  return (
                    <Fragment key={`activity-${activityKey}`}>
                      <Draggable draggableId={activityKey} index={index}>
                        {(itemProvided, snapshot) => (
                          <Box
                            {...itemProvided.draggableProps}
                            ref={itemProvided.innerRef}
                            data-testid={dataTestid}
                          >
                            <Item
                              {...activity}
                              onItemClick={
                                isEditVisible ? () => handleEditActivity(index) : undefined
                              }
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
                                  'data-testid': dataTestid,
                                })
                              }
                              hasError={hasError}
                              count={activity.items?.length}
                              data-testid={dataTestid}
                            />
                            <InsertItem
                              isVisible={index >= 0 && index < activities.length - 1 && !isDragging}
                              onInsert={() => handleActivityAdd({ index: index + 1 })}
                              data-testid={`${dataTestid}-insert`}
                            />
                          </Box>
                        )}
                      </Draggable>
                      <DeleteActivityModal
                        activityName={activityName}
                        isOpen={activityToDelete === activityKey}
                        onModalClose={handleModalClose}
                        onModalSubmit={() => handleActivityRemove(index, activityKey)}
                        data-testid={`builder-activities-delete-activity-popup-${index}`}
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
    </BuilderContainer>
  );
};
