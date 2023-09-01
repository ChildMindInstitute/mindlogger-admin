import { generatePath } from 'react-router-dom';

import { Svg } from 'shared/components';
import { page } from 'resources';

export const getActivityFlowTabs = ({
  appletId,
  activityFlowId,
}: {
  appletId?: string;
  activityFlowId?: string;
}) => [
  {
    labelKey: 'aboutActivityFlow',
    icon: <Svg id="more-info-outlined" />,
    activeIcon: <Svg id="more-info-filled" />,
    path: generatePath(page.builderAppletActivityFlowItemAbout, { appletId, activityFlowId }),
    'data-testid': 'builder-tab-about-activity-flow',
  },
  {
    labelKey: 'activityFlowBuilder',
    icon: <Svg id="checklist-outlined" />,
    activeIcon: <Svg id="checklist-filled" />,
    path: generatePath(page.builderAppletActivityFlowItemBuilder, { appletId, activityFlowId }),
    'data-testid': 'builder-tab-activity-flow-builder',
  },
  {
    labelKey: 'activityFlowSettings',
    icon: <Svg id="settings" />,
    activeIcon: <Svg id="settings-filled" />,
    path: generatePath(page.builderAppletActivityFlowItemSettings, { appletId, activityFlowId }),
    'data-testid': 'builder-tab-activity-flow-settings',
  },
];
