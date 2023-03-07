import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';

import { Calendar } from './Calendar';
import { Legend } from './Legend';
import { StyledLeftPanel, StyledSchedule } from './Schedule.styles';

export const Schedule = () => {
  const { t } = useTranslation('app');

  useBreadcrumbs([
    {
      icon: <Svg id="schedule-outlined" width="14" height="14" />,
      label: t('schedule'),
    },
  ]);

  return (
    <StyledSchedule>
      <StyledLeftPanel>
        <Legend />
      </StyledLeftPanel>
      <Calendar />
    </StyledSchedule>
  );
};
