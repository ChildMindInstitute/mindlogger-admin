import { Svg } from 'shared/components';
import { page } from 'resources';

export const newActivityTabs = [
  {
    id: 'simple-tabpanel-about',
    labelKey: 'aboutActivity',
    icon: <Svg id="more-info-outlined" />,
    activeIcon: <Svg id="more-info-filled" />,
    path: page.newAppletNewActivityAbout,
  },
  {
    id: 'simple-tabpanel-items',
    labelKey: 'items',
    icon: <Svg id="item-outlined" />,
    activeIcon: <Svg id="item-filled" />,
    path: page.newAppletNewActivityItems,
  },
  {
    id: 'simple-tabpanel-flow',
    labelKey: 'itemFlow',
    icon: <Svg id="flow-outlined" />,
    activeIcon: <Svg id="flow-filled" />,
    path: page.newAppletNewActivityItemFlow,
  },
  {
    id: 'simple-tabpanel-settings',
    labelKey: 'activitySettings',
    icon: <Svg id="settings" />,
    activeIcon: <Svg id="settings-filled" />,
    path: page.newAppletNewActivitySettings,
  },
];
