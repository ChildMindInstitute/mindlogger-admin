import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useBreadcrumbs } from 'shared/hooks';
import { applet } from 'shared/state';
import { applets, calendarEvents } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store';

import { Calendar } from './Calendar';
import { Legend } from './Legend';
import { StyledLeftPanel, StyledSchedule } from './Schedule.styles';
import { usePreparedEvents } from './Schedule.hooks';

export const Schedule = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { respondentId } = useParams();
  const { result: appletData } = applet.useAppletData() ?? {};
  const appletId = appletData?.id || '';
  const preparedEvents = usePreparedEvents(appletData);

  useBreadcrumbs([
    {
      icon: 'schedule-outlined',
      label: t('schedule'),
    },
  ]);

  useEffect(() => {
    if (!appletId) return;

    const { getEvents } = applets.thunk;
    dispatch(getEvents({ appletId, respondentId }));

    return () => {
      dispatch(applets.actions.resetEventsData());
      dispatch(calendarEvents.actions.resetCalendarEvents());
    };
  }, [appletId, respondentId]);

  return (
    <StyledSchedule>
      <StyledLeftPanel>
        <Legend
          legendEvents={preparedEvents}
          appletName={appletData?.displayName || ''}
          appletId={appletId}
        />
      </StyledLeftPanel>
      <Calendar />
    </StyledSchedule>
  );
};
