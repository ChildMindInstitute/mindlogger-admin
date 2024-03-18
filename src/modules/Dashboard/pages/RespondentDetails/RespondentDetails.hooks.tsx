import { generatePath, useParams } from 'react-router-dom';

import { page } from 'resources';
import { Svg } from 'shared/components';

export const useRespondentDetailsTabs = () => {
  const { appletId, respondentId } = useParams();

  return [
    {
      labelKey: 'activities',
      id: 'respondent-activities',
      icon: <Svg id="activities-outlined" />,
      activeIcon: <Svg id="activities-filled" />,
      path: generatePath(page.appletRespondentDetails, {
        appletId,
        respondentId,
      }),
      'data-testid': 'respondents-activities',
    },
    {
      labelKey: 'connections',
      id: 'respondent-connections',
      icon: <Svg id="respondent-circle" />,
      activeIcon: <Svg id="respondent-circle-filled" />,
      path: generatePath(page.appletRespondentConnections, {
        appletId,
        respondentId,
      }),
      'data-testid': 'respondents-connections',
    },
    {
      labelKey: 'schedule',
      id: 'respondent-schedule',
      icon: <Svg id="schedule-outlined" />,
      activeIcon: <Svg id="schedule-filled" />,
      path: generatePath(page.appletRespondentSchedule, {
        appletId,
        respondentId,
      }),
      'data-testid': 'respondents-schedule',
    },
  ];
};
