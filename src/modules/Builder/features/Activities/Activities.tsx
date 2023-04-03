import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Svg } from 'shared/components';
import { StyledTitleMedium, StyledBuilderWrapper } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { useBreadcrumbs } from 'shared/hooks';
import { Activity } from 'shared/types';
import { getNewActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';

import { Header, Item } from '../../components';
import { getActions } from './Activities.const';

export const Activities = () => {
  const { t } = useTranslation('app');

  const { control, watch } = useFormContext();

  const { append: appendActivity } = useFieldArray({
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

  const handleAddActivity = () => {
    appendActivity(getNewActivity());
  };

  return (
    <StyledBuilderWrapper>
      <Header
        title={t('activities')}
        buttons={[
          {
            icon: <Svg id="checklist-filled" />,
            label: t('addActivity'), // TODO add Applet Activity Name on Edit
            handleClick: handleAddActivity,
          },
        ]}
      />
      {activities?.length ? (
        activities.map((item: Activity) => (
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
    </StyledBuilderWrapper>
  );
};
