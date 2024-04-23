import { generatePath, useParams } from 'react-router-dom';

import { page } from 'resources';
import { Svg } from 'shared/components';

export const useParticipantDetailsTabs = () => {
  const { appletId, subjectId } = useParams();

  return [
    {
      labelKey: 'activities',
      id: 'participant-activities',
      icon: <Svg id="checklist-outlined" />,
      activeIcon: <Svg id="checklist-filled" />,
      path: generatePath(page.appletParticipantActivities, {
        appletId,
        subjectId,
      }),
      'data-testid': 'participant-activities',
    },
    {
      labelKey: 'connections',
      id: 'participant-connections',
      icon: <Svg id="respondent-circle" />,
      activeIcon: <Svg id="respondent-circle-filled" />,
      path: generatePath(page.appletParticipantConnections, {
        appletId,
        subjectId,
      }),
      'data-testid': 'participant-connections',
    },
    {
      labelKey: 'schedule',
      id: 'participant-schedule',
      icon: <Svg id="schedule-outlined" />,
      activeIcon: <Svg id="schedule-filled" />,
      path: generatePath(page.appletParticipantSchedule, {
        appletId,
        subjectId,
      }),
      'data-testid': 'participant-schedule',
    },
  ];
};
