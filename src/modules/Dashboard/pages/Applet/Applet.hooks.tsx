import { generatePath, useParams } from 'react-router-dom';

import { Svg } from 'shared/components/Svg';
import { page } from 'resources';
import { Mixpanel } from 'shared/utils';

export const useAppletTabs = () => {
  const { appletId } = useParams();

  return [
    {
      labelKey: 'respondents',
      id: 'applet-respondents',
      icon: <Svg id="respondent-outlined" />,
      activeIcon: <Svg id="respondent-filled" />,
      path: generatePath(page.appletRespondents, {
        appletId,
      }),
      'data-testid': 'dashboard-tab-respondents',
    },
    {
      labelKey: 'managers',
      id: 'applet-managers',
      icon: <Svg id="manager-outlined" />,
      activeIcon: <Svg id="manager-filled" />,
      path: generatePath(page.appletManagers, {
        appletId,
      }),
      'data-testid': 'dashboard-tab-managers',
    },
    {
      labelKey: 'addUsers',
      id: 'applet-add-users',
      icon: <Svg id="add-users-outlined" />,
      activeIcon: <Svg id="add-users-filled" />,
      isMinHeightAuto: true,
      path: generatePath(page.appletAddUser, {
        appletId,
      }),
      'data-testid': 'dashboard-tab-add-users',
    },
    {
      labelKey: 'schedule',
      id: 'applet-schedule',
      icon: <Svg id="schedule-outlined" />,
      activeIcon: <Svg id="schedule-filled" />,
      onClick: () => Mixpanel.track('View General calendar click'),
      path: generatePath(page.appletSchedule, {
        appletId,
      }),
      'data-testid': 'dashboard-tab-calendar',
    },
    {
      labelKey: 'appletSettings',
      id: 'applet-settings',
      icon: <Svg id="settings" />,
      activeIcon: <Svg id="settings-filled" />,
      path: generatePath(page.appletSettings, {
        appletId,
      }),
      'data-testid': 'dashboard-tab-settings',
    },
  ];
};
