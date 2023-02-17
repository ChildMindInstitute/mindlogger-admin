import { Svg } from 'components';
import { page } from 'resources';

export const pathsWithInnerTabs = [page.newAppletNewActivity, page.newAppletNewActivityFlow];

export const newAppletTabs = [
  {
    labelKey: 'aboutApplet',
    icon: <Svg id="more-info-outlined" />,
    activeIcon: <Svg id="more-info-filled" />,
    path: page.newAppletAbout,
  },
  {
    labelKey: 'activities',
    icon: <Svg id="checklist-outlined" />,
    activeIcon: <Svg id="checklist-filled" />,
    path: page.newAppletActivities,
  },
  {
    labelKey: 'activityFlow',
    icon: <Svg id="flow-outlined" />,
    activeIcon: <Svg id="flow-filled" />,
    path: page.newAppletActivityFlow,
  },
  {
    labelKey: 'appletSettings',
    icon: <Svg id="settings" />,
    activeIcon: <Svg id="settings-filled" />,
    path: page.newAppletSettings,
  },
];
