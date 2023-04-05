import { Fragment, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams, generatePath } from 'react-router-dom';

import { Svg, Modal } from 'shared/components';
import { StyledTitleMedium, StyledFlexColumn, theme, StyledModalWrapper } from 'shared/styles';
import { page } from 'resources';
import { useBreadcrumbs } from 'shared/hooks';
import { ActivityFormValues } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.types';
import { getNewActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { BuilderContainer } from 'shared/features';

import { Item } from '../../components';
import { getActions } from './Activities.const';
import { ActivitiesHeader } from './ActivitiesHeader';

export const Activities = () => {
  const { t } = useTranslation('app');
  const { control, watch } = useFormContext();
  const navigate = useNavigate();
  const { appletId } = useParams();
  const [deletionModalVisible, setDeletionModalVisible] = useState(false);

  const {
    insert: insertActivity,
    remove: removeActivity,
    update: updateActivity,
  } = useFieldArray({
    control,
    name: 'activities',
  });

  const activities = watch('activities');

  useBreadcrumbs([
    {
      icon: <Svg id="checklist-filled" width="18" height="18" />,
      label: t('activities'),
    },
  ]);

  const navigateToActivity = (id: string) =>
    navigate(
      generatePath(page.builderAppletActivityAbout, {
        appletId,
        activityId: id,
      }),
    );
  const handleHideModal = () => setDeletionModalVisible(false);

  return (
    <BuilderContainer title={t('activities')} Header={ActivitiesHeader}>
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

            const activityName = item.name || 'New Activity';

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
                      onRemove: () => setDeletionModalVisible(true),
                      onVisibilityChange: handleVisibilityChange,
                    })
                  }
                  withHover
                />
                <Modal
                  open={deletionModalVisible}
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
