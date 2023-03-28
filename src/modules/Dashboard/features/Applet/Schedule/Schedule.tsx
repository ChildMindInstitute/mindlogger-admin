import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';
import { applets } from 'modules/Dashboard/state';

import { Calendar } from './Calendar';
import { Legend } from './Legend';
import { StyledLeftPanel, StyledSchedule } from './Schedule.styles';
import { getPreparedEvents } from './Schedule.utils';

export const Schedule = () => {
  const { t } = useTranslation('app');
  const appletData = applets.useAppletData();
  const eventsData = applets.useEventsData();
  const preparedEvents = getPreparedEvents(appletData?.result, eventsData?.result);

  useBreadcrumbs([
    {
      icon: <Svg id="schedule-outlined" width="14" height="14" />,
      label: t('schedule'),
    },
  ]);

  return (
    <StyledSchedule>
      <StyledLeftPanel>
        <Legend legendEvents={preparedEvents} />
      </StyledLeftPanel>
      <Calendar />
    </StyledSchedule>
  );
};
