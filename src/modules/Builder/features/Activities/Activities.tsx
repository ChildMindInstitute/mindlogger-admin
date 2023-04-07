import { Fragment, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams, generatePath } from 'react-router-dom';

import { Svg, Modal } from 'shared/components';
import { StyledTitleMedium, StyledFlexColumn, StyledModalWrapper, theme } from 'shared/styles';
import { page } from 'resources';
import { useBreadcrumbs } from 'shared/hooks';
import { ActivityFormValues } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.types';
import { getNewActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { BuilderContainer } from 'shared/features';

import { Item } from '../../components';
import { ActivitiesHeader } from './ActivitiesHeader';
import { getActions } from './Activities.const';

export const Activities = () => {
  const { t } = useTranslation('app');
  const { control, watch, getFieldState } = useFormContext();
  const navigate = useNavigate();
  const { appletId } = useParams();
  const [activityToDelete, setActivityToDelete] = useState<string | undefined>('');

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

  const errors = activities?.reduce(
    (err: Record<string, boolean>, _: ActivityFormValues, index: number) => ({
      ...err,
      [`activities[${index}]`]: !!getFieldState(`activities[${index}]`).error,
    }),
    {},
  );

  useBreadcrumbs([
    {
      icon: <Svg id="checklist-filled" width="18" height="18" />,
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

  return (
    <BuilderContainer
      title={t('activities')}
      Header={ActivitiesHeader}
      headerProps={{ onAddActivity: handleAddActivity }}
    >
      <StyledFlexColumn>
        {activities?.length ? (
          activities.map((item: ActivityFormValues, index: number) => {
            const handleEdit = () => navigateToActivity(item.key ?? item.id);
            //TODO: check if dependent activity flow is required to remove
            const handleRemove = () => removeActivity(index);
            //TODO: check if some items properties in duplicated activity are needed to be changed
            const handleDuplicate = () => {
              const newActivity = getNewActivity(item);

              insertActivity(index + 1, newActivity);

              navigateToActivity(newActivity.key);
            };
            const handleVisibilityChange = () =>
              updateActivity(index, { ...item, isHidden: !item.isHidden });

            const activityName = item.name;
            const hasError = !!errors[`activities[${index}]`];

            return (
              <Fragment key={`activity-${item.key ?? item.id}`}>
                <Item
                  {...item}
                  img={item.image}
                  isInactive={item.isHidden}
                  hasStaticActions={item.isHidden}
                  getActions={() =>
                    getActions({
                      key: item.key ?? item.id ?? '',
                      isActivityHidden: item.isHidden,
                      onEdit: handleEdit,
                      onDuplicate: handleDuplicate,
                      onRemove: () => setActivityToDelete(item.key || item.id),
                      onVisibilityChange: handleVisibilityChange,
                    })
                  }
                  hasError={hasError}
                  withHover
                />
                <Modal
                  open={activityToDelete === (item.key || item.id)}
                  onClose={handleHideModal}
                  onSubmit={handleRemove}
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
