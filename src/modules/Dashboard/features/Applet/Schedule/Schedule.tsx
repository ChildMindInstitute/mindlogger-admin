import { useTranslation } from 'react-i18next';

import { useBreadcrumbs } from 'shared/hooks';
import { applet } from 'shared/state';

import { Calendar } from './Calendar';
import { Legend } from './Legend';
import { StyledLeftPanel, StyledSchedule } from './Schedule.styles';
import { usePreparedEvents } from './Schedule.hooks';

export const Schedule = () => {
  const { t } = useTranslation('app');
  const { result: appletData } = applet.useAppletData() ?? {};
  const preparedEvents = usePreparedEvents(appletData);

  useBreadcrumbs([
    {
      icon: 'schedule-outlined',
      label: t('schedule'),
    },
  ]);

  return (
    <StyledSchedule>
      <StyledLeftPanel>
        <Legend
          legendEvents={preparedEvents}
          appletName={appletData?.displayName || ''}
          appletId={appletData?.id || ''}
        />
      </StyledLeftPanel>
      <Calendar />
    </StyledSchedule>
  );
};
