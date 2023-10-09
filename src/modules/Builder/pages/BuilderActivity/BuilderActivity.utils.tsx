import { generatePath } from 'react-router-dom';

import { Svg } from 'shared/components/Svg';
import { page } from 'resources';

export const getActivityTabs = (
  params: { activityId?: string; appletId?: string },
  {
    hasAboutActivityErrors,
    hasActivityItemsErrors,
    hasActivityReportsErrors,
    hasActivitySubscalesErrors,
    hasActivityItemsFlowErrors,
  }: Record<string, boolean>,
) => [
  {
    id: 'simple-tabpanel-about',
    labelKey: 'aboutActivity',
    icon: <Svg id="more-info-outlined" />,
    activeIcon: <Svg id="more-info-filled" />,
    path: generatePath(page.builderAppletActivityAbout, params),
    hasError: hasAboutActivityErrors,
    'data-testid': 'builder-tab-about-activity',
  },
  {
    id: 'simple-tabpanel-items',
    labelKey: 'items',
    icon: <Svg id="item-outlined" />,
    activeIcon: <Svg id="item-filled" />,
    path: generatePath(page.builderAppletActivityItems, params),
    hasError: hasActivityItemsErrors,
    'data-testid': 'builder-tab-activity-items',
  },
  {
    id: 'simple-tabpanel-flow',
    labelKey: 'itemFlow',
    icon: <Svg id="flow-outlined" />,
    activeIcon: <Svg id="flow-filled" />,
    path: generatePath(page.builderAppletActivityItemFlow, params),
    hasError: hasActivityItemsFlowErrors,
    'data-testid': 'builder-tab-activity-item-flow',
  },
  {
    id: 'simple-tabpanel-settings',
    labelKey: 'activitySettings',
    icon: <Svg id="settings" />,
    activeIcon: <Svg id="settings-filled" />,
    path: generatePath(page.builderAppletActivitySettings, params),
    hasError: hasActivitySubscalesErrors || hasActivityReportsErrors,
    'data-testid': 'builder-tab-activity-settings',
  },
];
