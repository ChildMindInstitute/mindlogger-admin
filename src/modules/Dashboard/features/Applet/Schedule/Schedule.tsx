import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';
import { applets } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store';

import { Calendar } from './Calendar';
import { Legend } from './Legend';
import { StyledLeftPanel, StyledSchedule } from './Schedule.styles';

export const Schedule = () => {
  const { t } = useTranslation('app');
  const { id } = useParams();
  const dispatch = useAppDispatch();

  useBreadcrumbs([
    {
      icon: <Svg id="schedule-outlined" width="14" height="14" />,
      label: t('schedule'),
    },
  ]);

  useEffect(() => {
    if (!id) return;

    dispatch(applets.thunk.getEvents({ appletId: id }));
  }, [id]);

  return (
    <StyledSchedule>
      <StyledLeftPanel>
        <Legend />
      </StyledLeftPanel>
      <Calendar />
    </StyledSchedule>
  );
};
