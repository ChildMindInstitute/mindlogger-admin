import { generatePath, useParams } from 'react-router-dom';

import { Svg } from 'shared/components/Svg';
import { page } from 'resources';
import { Mixpanel, MixpanelEventType } from 'shared/utils';

export const useMultiInformantAppletTabs = () => {
  const { appletId } = useParams();

  return [
    {
      labelKey: 'appletNavigationOverview',
      id: 'applet-overview',
      icon: <Svg id="home" />,
      activeIcon: <Svg id="home-filled" />,
      path: generatePath(page.appletOverview, {
        appletId,
      }),
      'data-testid': 'dashboard-tab-overview',
    },
    {
      labelKey: 'appletNavigationActivities',
      id: 'applet-activities',
      icon: <Svg id="checklist-outlined" />,
      activeIcon: <Svg id="checklist-outlined" />,
      path: generatePath(page.appletActivities, {
        appletId,
      }),
      'data-testid': 'dashboard-tab-activities',
    },
    {
      labelKey: 'appletNavigationParticipants',
      id: 'applet-respondents',
      icon: <Svg id="respondent-circle" />,
      activeIcon: <Svg id="respondent-circle-filled" />,
      path: generatePath(page.appletParticipants, {
        appletId,
      }),
      'data-testid': 'dashboard-tab-respondents',
    },
    {
      labelKey: 'schedule',
      id: 'applet-schedule',
      icon: <Svg id="schedule-outlined" />,
      activeIcon: <Svg id="schedule-outlined" />,
      onClick: () => Mixpanel.track({ action: MixpanelEventType.ViewGeneralCalendarClick }),
      path: generatePath(page.appletSchedule, {
        appletId,
      }),
      'data-testid': 'dashboard-tab-calendar',
    },
    {
      labelKey: 'appletNavigationTeam',
      id: 'applet-managers',
      icon: <Svg id="team-outlined" />,
      activeIcon: <Svg id="team-filled" />,
      path: generatePath(page.appletManagers, {
        appletId,
      }),
      'data-testid': 'dashboard-tab-managers',
    },
  ];
};
