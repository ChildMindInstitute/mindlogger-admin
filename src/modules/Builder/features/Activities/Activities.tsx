import { Fragment, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams, generatePath } from 'react-router-dom';
import { DragDropContext, Draggable, DragDropContextProps } from 'react-beautiful-dnd';
import { Box } from '@mui/material';

import { Modal } from 'shared/components';
import { StyledTitleMedium, StyledFlexColumn, theme, StyledModalWrapper } from 'shared/styles';
import { page } from 'resources';
import { useBreadcrumbs } from 'shared/hooks';
import { ActivityFormValues, AppletFormValues } from 'modules/Builder/pages/BuilderApplet';
import { ItemUiType, InsertItem, DndDroppable } from 'modules/Builder/components';
import { getNewActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { BuilderContainer } from 'shared/features';

import { Item } from '../../components';
import { ActivitiesHeader } from './ActivitiesHeader';
import { getActions } from './Activities.const';
import { getActivityKey } from './Activities.utils';

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

  const activities = watch('activities');
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
  const handleHideModal = () => setActivityToDelete('');
  const handleAddActivity = (index?: number) => {
    const newActivity = getNewActivity();

    typeof index === 'number' ? insertActivity(index, newActivity) : appendActivity(newActivity);
    navigateToActivity(newActivity.key);
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

  const handleDuplicateActivity = (index: number) => {
    const activityToDuplicate = activities[index];
    setDuplicateIndexes((prevState) => {
      const numberToInsert = (prevState[getActivityKey(activityToDuplicate)] || 0) + 1;

      insertActivity(index + 1, {
        ...getNewActivity(activityToDuplicate),
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
    navigateToActivity(getActivityKey(activityToEdit));
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
      headerProps={{ onAddActivity: handleAddActivity }}
    >
      <StyledFlexColumn>
        {activities?.length ? (
          <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
            <DndDroppable droppableId="activities-dnd" direction="vertical">
              {(listProvided) => (
                <Box {...listProvided.droppableProps} ref={listProvided.innerRef}>
                  {activities.map((activity: ActivityFormValues, index: number) => {
                    const activityKey = getActivityKey(activity);

                    const activityName = activity.name;
                    const hasError = !!errors[`activities[${index}]`];

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
                                    onDuplicate: () => handleDuplicateActivity(index),
                                    onRemove: () => setActivityToDelete(activityKey),
                                    onVisibilityChange: () => handleActivityVisibilityChange(index),
                                  })
                                }
                                hasError={hasError}
                              />
                              <InsertItem
                                isVisible={
                                  index >= 0 && index < activities.length - 1 && !isDragging
                                }
                                onInsert={() => handleAddActivity(index + 1)}
                              />
                            </Box>
                          )}
                        </Draggable>
                        <Modal
                          open={activityToDelete === activityKey}
                          onClose={handleHideModal}
                          onSubmit={() => handleActivityRemove(index, activityKey)}
                          onSecondBtnSubmit={handleHideModal}
                          title={t('deleteActivity')}
                          buttonText={t('delete')}
                          secondBtnText={t('cancel')}
                          hasSecondBtn
                          submitBtnColor="error"
                        >
                          <StyledModalWrapper>
                            <Trans i18nKey="deleteActivityDescription">
                              Are you sure you want to delete the Activity
                              <strong>
                                <>{{ activityName }}</>
                              </strong>
                              ?
                            </Trans>
                          </StyledModalWrapper>
                        </Modal>
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
