import { generatePath, useParams } from 'react-router-dom';

import { page } from 'resources';
import { Svg } from 'shared/components';

export const useParticipantActivityDetailsTabs = () => {
  const { appletId, subjectId, activityId } = useParams();

  return [
    {
      labelKey: 'summary',
      id: 'participant-activity-summary',
      icon: <Svg id="chart" />,
      activeIcon: <Svg id="chart" />,
      path: generatePath(page.appletParticipantActivityDetailsDataSummary, {
        appletId,
        subjectId,
        activityId,
      }),
      'data-testid': 'participant-activity-summary',
    },
    {
      labelKey: 'responses',
      id: 'participant-activity-responses',
      icon: <Svg id="checkbox-outlined" />,
      activeIcon: <Svg id="checkbox-filled" />,
      path: generatePath(page.appletParticipantActivityDetailsDataReview, {
        appletId,
        subjectId,
        activityId,
      }),
      'data-testid': 'participant-activity-responses',
    },
  ];
};
