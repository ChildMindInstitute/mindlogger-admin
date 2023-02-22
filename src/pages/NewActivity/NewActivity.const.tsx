import { Svg } from 'components';
import { page } from 'resources';

export const newActivityTabs = [
  {
    labelKey: 'aboutActivity',
    icon: <Svg id="more-info-outlined" />,
    activeIcon: <Svg id="more-info-filled" />,
    path: page.newAppletNewActivityAbout,
  },
  {
    labelKey: 'items',
    icon: <Svg id="item-outlined" />,
    activeIcon: <Svg id="item-filled" />,
    path: page.newAppletNewActivityItems,
  },
  {
    labelKey: 'itemFlow',
    icon: <Svg id="flow-outlined" />,
    activeIcon: <Svg id="flow-filled" />,
    path: page.newAppletNewActivityItemFlow,
  },
  {
    labelKey: 'activitySettings',
    icon: <Svg id="settings" />,
    activeIcon: <Svg id="settings-filled" />,
    path: page.newAppletNewActivitySettings,
  },
];
