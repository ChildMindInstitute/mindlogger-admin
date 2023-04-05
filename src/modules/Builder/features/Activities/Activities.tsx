import { useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams, generatePath } from 'react-router-dom';

import { Svg } from 'shared/components';
import { StyledTitleMedium, StyledFlexColumn, theme } from 'shared/styles';
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

  const {
    append: appendActivity,
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

  return (
    <BuilderContainer title={t('activities')} Header={ActivitiesHeader}>
      <StyledFlexColumn>
        {activities?.length ? (
          activities.map((item: ActivityFormValues, index: number) => {
            //TODO: check if dependent activity flow is required to remove
            const handleRemove = () => removeActivity(index);
            //TODO: check if some items properties in duplicated activity are needed to be changed
            const handleDuplicate = () => {
              const newActivity = getNewActivity(item);

              appendActivity(newActivity);

              navigate(
                generatePath(page.builderAppletActivityAbout, {
                  appletId,
                  activityId: newActivity.key,
                }),
              );
            };
            const handleVisibilityChange = () =>
              updateActivity(index, { ...item, isHidden: !item.isHidden });

            return (
              <Item
                {...item}
                key={`activity-${item.key ?? item.id}`}
                getActions={() =>
                  getActions({
                    key: item.key ?? item.id ?? '',
                    isHidden: item.isHidden,
                    onDuplicate: handleDuplicate,
                    onRemove: handleRemove,
                    onVisibilityChange: handleVisibilityChange,
                  })
                }
                withHover
              />
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
