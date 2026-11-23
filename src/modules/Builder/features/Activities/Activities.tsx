import React, { Fragment, useState, useCallback, useContext, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
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
import { BuilderSaveContext } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.context';
import { BuilderContainer } from 'shared/features';
import { PerfTaskType } from 'shared/consts';
import { pluck, Mixpanel, MixpanelEventType, MixpanelProps, getErrorMessage } from 'shared/utils';
import { useAsync } from 'shared/hooks/useAsync';
import { useCheckIfNewApplet } from 'shared/hooks/useCheckIfNewApplet';
import { banners } from 'shared/state';
import { useAppDispatch } from 'redux/store';
import { getUniqueName, getUpdatedActivityFlows } from 'modules/Builder/utils';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { copyActivityApi } from 'modules/Builder/api';

import { DeleteActivityModal } from './DeleteActivityModal';
import { CopyActivityModal, CopyTargetApplet } from './CopyActivityModal';
import { SaveBeforeCopyPopup } from './SaveBeforeCopyPopup';
import { ActivitiesHeader } from './ActivitiesHeader';
import { getActions, getActivityKey, getPerformanceTaskPath } from './Activities.utils';
import { ActivityAddProps, ActivityToCopy, EditablePerformanceTasksType } from './Activities.types';
import { EditablePerformanceTasks } from './Activities.const';

// Memoized Activity Item component for better performance
const ActivityDraggableItem = React.memo<{
  activity: ActivityFormValues;
  index: number;
  activityKey: string;
  isPerformanceTask: boolean;
  activityName: string;
  isEditVisible: boolean;
  hasError: boolean;
  dataTestid: string;
  isDragging: boolean;
  isLastItem: boolean;
  handleEditActivity: (index: number) => void;
  handleDuplicateActivity: (index: number, isPerformanceTask: boolean) => void;
  handleActivityVisibilityChange: (index: number) => void;
  handleActivityAdd: (props: ActivityAddProps) => void;
  setActivityToDelete: (key: string) => void;
  handleCopyClick: (index: number) => void;
  copyDisabledTooltip?: string;
}>(
  ({
    activity,
    index,
    activityKey,
    isPerformanceTask,
    activityName,
    isEditVisible,
    hasError,
    dataTestid,
    isDragging,
    isLastItem,
    handleEditActivity,
    handleDuplicateActivity,
    handleActivityVisibilityChange,
    handleActivityAdd,
    setActivityToDelete,
    handleCopyClick,
    copyDisabledTooltip,
  }) => (
    <Draggable draggableId={activityKey} index={index}>
      {(itemProvided, snapshot) => (
        <Box {...itemProvided.draggableProps} ref={itemProvided.innerRef} data-testid={dataTestid}>
          <Item
            {...activity}
            onItemClick={isEditVisible ? () => handleEditActivity(index) : undefined}
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
                onDuplicate: () => handleDuplicateActivity(index, isPerformanceTask),
                onCopy: () => handleCopyClick(index),
                copyDisabledTooltip,
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
            isVisible={!isLastItem && !isDragging}
            onInsert={() => handleActivityAdd({ index: index + 1 })}
            data-testid={`${dataTestid}-insert`}
          />
        </Box>
      )}
    </Draggable>
  ),
);

ActivityDraggableItem.displayName = 'ActivityDraggableItem';

export const Activities = () => {
  const { t } = useTranslation('app');
  const { control, getFieldState, setValue, clearErrors } = useCustomFormContext();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { appletId } = useParams();
  const [activityToDelete, setActivityToDelete] = useState<string>('');
  const [activityToCopy, setActivityToCopy] = useState<ActivityToCopy | null>(null);
  const [indexToSaveBeforeCopy, setIndexToSaveBeforeCopy] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const builderSaveRef = useContext(BuilderSaveContext);
  const isNewApplet = useCheckIfNewApplet();

  const {
    fields,
    append: appendActivity,
    insert: insertActivity,
    remove: removeActivity,
    update: updateActivity,
    move: moveActivity,
    // @TODO: Error created as a ticket on: https://mindlogger.atlassian.net/browse/M2-7383
    // @ts-expect-error Type instantiation is excessively deep and possibly infinite.ts(2589)
  } = useFieldArray<Record<string, ActivityFormValues[]>, string, typeof REACT_HOOK_FORM_KEY_NAME>({
    control,
    name: 'activities',
    keyName: REACT_HOOK_FORM_KEY_NAME,
  });
  const activities = fields as unknown as ActivityFormValues[];

  const activityNames = useMemo(() => pluck(activities, 'name'), [activities]);
  const activityFlows = useWatch({ name: 'activityFlows' }) as AppletFormValues['activityFlows'];
  const errors = useMemo(
    () => activities?.map((_, index) => !!getFieldState(`activities.${index}`).error),
    [activities, getFieldState],
  );

  const navigateToActivity = useCallback(
    (activityId?: string) =>
      activityId &&
      navigate(
        generatePath(page.builderAppletActivityAbout, {
          appletId,
          activityId,
        }),
      ),
    [navigate, appletId],
  );
  const navigateToPerformanceTask = useCallback(
    (activityId?: string, performanceTasksType?: PerfTaskType) =>
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
      ),
    [navigate, appletId],
  );
  const handleModalClose = useCallback(() => setActivityToDelete(''), []);
  const {
    execute: copyActivity,
    isLoading: isCopying,
    error: copyError,
    setError: setCopyError,
  } = useAsync(copyActivityApi, (response) => {
    setActivityToCopy(null);
    const { displayName, activities: targetActivities } = response?.data?.result ?? {};
    dispatch(
      banners.actions.addBanner({
        key: 'SaveSuccessBanner',
        bannerProps: {
          children: (
            <Trans
              components={{ 1: <strong />, 3: <strong /> }}
              i18nKey="copyActivitySuccess"
              t={t}
              // The copy goes last and may have been renamed
              values={{ activityName: targetActivities?.at(-1)?.name, appletName: displayName }}
            />
          ),
          'data-testid': 'builder-activities-copy-success-banner',
        },
      }),
    );
  });
  const handleCopyModalClose = useCallback(() => {
    setActivityToCopy(null);
    setCopyError(null);
  }, [setCopyError]);
  const handleCopyClick = useCallback(
    (index: number) => {
      const { id, name } = activities[index];
      if (id && !builderSaveRef?.current?.hasFormChanges) return setActivityToCopy({ id, name });

      setIndexToSaveBeforeCopy(index);
    },
    [activities, builderSaveRef],
  );
  const handleSaveBeforeCopy = async () => {
    const index = indexToSaveBeforeCopy;
    setIndexToSaveBeforeCopy(null);
    const savedApplet = await builderSaveRef?.current?.save();
    // The saved applet keeps the form's activity order
    const savedActivity = index === null ? undefined : savedApplet?.activities?.[index];
    if (!savedActivity?.id) return;

    setActivityToCopy({ id: savedActivity.id, name: savedActivity.name });
  };
  const handleCopyActivity = ({ id: targetAppletId }: CopyTargetApplet) => {
    const activityId = activityToCopy?.id;
    if (!appletId || !activityId) return;

    // The error is shown in the modal
    copyActivity({ appletId, activityId, targetAppletId }).catch(() => undefined);
  };
  const handleActivityAdd = useCallback(
    (props: ActivityAddProps) => {
      Mixpanel.track({
        action: MixpanelEventType.AddActivityClick,
        [MixpanelProps.AppletId]: appletId,
      });
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
    },
    [
      activities?.length,
      activityNames,
      appendActivity,
      insertActivity,
      clearErrors,
      navigateToActivity,
      navigateToPerformanceTask,
      appletId,
      t,
    ],
  );

  const handleActivityRemove = useCallback(
    (index: number, activityKey: string) => {
      const newActivityFlows = getUpdatedActivityFlows(activityFlows, activityKey);
      removeActivity(index);
      setValue('activityFlows', newActivityFlows);
    },
    [activityFlows, removeActivity, setValue],
  );

  const handleDuplicateActivity = useCallback(
    (index: number, isPerformanceTask: boolean) => {
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
    },
    [activities, activityNames, insertActivity],
  );

  const handleEditActivity = useCallback(
    (index: number) => {
      Mixpanel.track({
        action: MixpanelEventType.ActivityEditClick,
        [MixpanelProps.AppletId]: appletId,
      });
      const activityToEdit = activities[index];
      const activityKey = getActivityKey(activityToEdit);
      if (activityToEdit.isPerformanceTask && activityToEdit.performanceTaskType) {
        return navigateToPerformanceTask(activityKey, activityToEdit.performanceTaskType);
      }

      return navigateToActivity(activityKey);
    },
    [activities, appletId, navigateToActivity, navigateToPerformanceTask],
  );

  const handleActivityVisibilityChange = useCallback(
    (index: number) => {
      const activityToChangeVisibility = activities[index];
      updateActivity(index, {
        ...activityToChangeVisibility,
        isHidden: !activityToChangeVisibility.isHidden,
      });
    },
    [activities, updateActivity],
  );

  const handleDragEnd = useCallback<DragDropContextProps['onDragEnd']>(
    ({ source, destination }) => {
      setIsDragging(false);
      if (!destination) return;
      moveActivity(source.index, destination.index);
    },
    [moveActivity],
  );

  return (
    <BuilderContainer
      title={t('activities')}
      Header={ActivitiesHeader}
      headerProps={{ onAddActivity: handleActivityAdd }}
      hasMaxWidth
    >
      {activities?.length ? (
        <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
          <DndDroppable
            droppableId="activities-dnd"
            direction="vertical"
            ignoreContainerClipping={true}
            isCombineEnabled={false}
          >
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
                  const isLastItem = index === activities.length - 1;

                  return (
                    <Fragment key={`activity-${activityKey}`}>
                      <ActivityDraggableItem
                        activity={activity}
                        index={index}
                        activityKey={activityKey}
                        isPerformanceTask={isPerformanceTask}
                        activityName={activityName}
                        isEditVisible={isEditVisible}
                        hasError={hasError}
                        dataTestid={dataTestid}
                        isDragging={isDragging}
                        isLastItem={isLastItem}
                        handleEditActivity={handleEditActivity}
                        handleDuplicateActivity={handleDuplicateActivity}
                        handleActivityVisibilityChange={handleActivityVisibilityChange}
                        handleActivityAdd={handleActivityAdd}
                        setActivityToDelete={setActivityToDelete}
                        handleCopyClick={handleCopyClick}
                        // A never-saved applet has nothing on the server to copy from
                        copyDisabledTooltip={isNewApplet ? t('saveAndPublishFirst') : undefined}
                      />
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
      <SaveBeforeCopyPopup
        isOpen={indexToSaveBeforeCopy !== null}
        onClose={() => setIndexToSaveBeforeCopy(null)}
        onSave={handleSaveBeforeCopy}
        data-testid="builder-activities-save-before-copy-popup"
      />
      <CopyActivityModal
        isOpen={!!activityToCopy}
        activityName={activityToCopy?.name ?? ''}
        isCopying={isCopying}
        errorMessage={copyError && getErrorMessage(copyError)}
        onClose={handleCopyModalClose}
        onSubmit={handleCopyActivity}
        data-testid="builder-activities-copy-activity-popup"
      />
    </BuilderContainer>
  );
};
