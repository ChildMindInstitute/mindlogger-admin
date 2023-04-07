import { useTranslation } from 'react-i18next';

import { useBreadcrumbs } from 'shared/hooks';
import { applet } from 'shared/state';
import { applets } from 'modules/Dashboard/state';

import { Calendar } from './Calendar';
import { Legend } from './Legend';
import { StyledLeftPanel, StyledSchedule } from './Schedule.styles';
import { usePreparedEvents } from './Schedule.hooks';

export const Schedule = () => {
  const { t } = useTranslation('app');
  const { result: appletData } = applet.useAppletData() ?? {};
  const { result: eventsData } = applets.useEventsData() ?? {};
  const preparedEvents = usePreparedEvents(appletData, eventsData);

  useBreadcrumbs([
    {
      icon: 'schedule-outlined',
      label: t('schedule'),
    },
  ]);

  return (
    <StyledSchedule>
      <StyledLeftPanel>
        <Legend legendEvents={preparedEvents} appletName={appletData?.displayName || ''} />
      </StyledLeftPanel>
      <Calendar />
    </StyledSchedule>
  );
};
