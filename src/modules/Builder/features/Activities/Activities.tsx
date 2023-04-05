import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { Svg } from 'shared/components';
import { StyledTitleMedium, StyledFlexColumn, theme } from 'shared/styles';
import { useBreadcrumbs } from 'shared/hooks';
import { ActivityFormValues } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.types';
import { BuilderContainer } from 'shared/features';

import { Item } from '../../components';
import { getActions } from './Activities.const';
import { ActivitiesHeader } from './ActivitiesHeader';

export const Activities = () => {
  const { t } = useTranslation('app');
  const { watch } = useFormContext();

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
          activities.map((item: ActivityFormValues) => (
            <Item
              {...item}
              key={`activity-${item.key ?? item.id}`}
              getActions={() => getActions(item.key ?? item.id ?? '')}
              withHover
            />
          ))
        ) : (
          <StyledTitleMedium sx={{ marginTop: theme.spacing(0.4) }}>
            {t('activityIsRequired')}
          </StyledTitleMedium>
        )}
      </StyledFlexColumn>
    </BuilderContainer>
  );
};
