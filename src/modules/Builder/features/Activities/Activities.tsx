import { Fragment, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams, generatePath } from 'react-router-dom';

import { Modal } from 'shared/components';
import { StyledTitleMedium, StyledFlexColumn, theme, StyledModalWrapper } from 'shared/styles';
import { page } from 'resources';
import { useBreadcrumbs } from 'shared/hooks';
import { ActivityFormValues, AppletFormValues } from 'modules/Builder/pages/BuilderApplet';
import { getNewActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { BuilderContainer } from 'shared/features';

import { Item } from '../../components';
import { ActivitiesHeader } from './ActivitiesHeader';
import { getActions } from './Activities.const';

export const Activities = () => {
  const { t } = useTranslation('app');
  const { control, watch, getFieldState, setValue } = useFormContext();
  const navigate = useNavigate();
  const { appletId } = useParams();
  const [activityToDelete, setActivityToDelete] = useState<string>('');

  const {
    append: appendActivity,
    insert: insertActivity,
    remove: removeActivity,
    update: updateActivity,
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
  const handleAddActivity = () => {
    const newActivity = getNewActivity();

    appendActivity(newActivity);
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

  return (
    <BuilderContainer
      title={t('activities')}
      Header={ActivitiesHeader}
      headerProps={{ onAddActivity: handleAddActivity }}
    >
      <StyledFlexColumn>
        {activities?.length ? (
          activities.map((activity: ActivityFormValues, index: number) => {
            const activityKey = activity.key ?? activity.id ?? '';
            const handleEdit = () => navigateToActivity(activityKey);

            //TODO: check if some items properties in duplicated activity are needed to be changed
            const handleDuplicate = () => {
              const newActivity = getNewActivity(activity);

              insertActivity(index + 1, newActivity);

              navigateToActivity(newActivity.key);
            };
            const handleVisibilityChange = () =>
              updateActivity(index, { ...activity, isHidden: !activity.isHidden });

            const activityName = activity.name;
            const hasError = !!errors[`activities[${index}]`];

            return (
              <Fragment key={`activity-${activityKey}`}>
                <Item
                  {...activity}
                  img={activity.image}
                  isInactive={activity.isHidden}
                  hasStaticActions={activity.isHidden}
                  getActions={() =>
                    getActions({
                      key: activityKey,
                      isActivityHidden: activity.isHidden,
                      onEdit: handleEdit,
                      onDuplicate: handleDuplicate,
                      onRemove: () => setActivityToDelete(activityKey),
                      onVisibilityChange: handleVisibilityChange,
                    })
                  }
                  hasError={hasError}
                />
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
          })
        ) : (
          <StyledTitleMedium sx={{ marginTop: theme.spacing(0.4) }}>
            {t('activityIsRequired')}
          </StyledTitleMedium>
        )}
      </StyledFlexColumn>
    </BuilderContainer>
  );
};
