import { Svg } from 'shared/components';
import { page } from 'resources';

export const dashboardTabs = [
  {
    labelKey: 'applets',
    icon: <Svg id="applet-outlined" />,
    activeIcon: <Svg id="applet-filled" />,
    path: page.dashboardApplets,
  },
  {
    labelKey: 'managers',
    icon: <Svg id="manager-outlined" />,
    activeIcon: <Svg id="manager-filled" />,
    path: page.dashboardManagers,
  },
  {
    labelKey: 'respondents',
    icon: <Svg id="respondent-outlined" />,
    activeIcon: <Svg id="respondent-filled" />,
    path: page.dashboardRespondents,
  },
];
