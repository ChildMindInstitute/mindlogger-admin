import { generatePath } from 'react-router-dom';

import { page } from 'resources';
import { Svg } from 'shared/components/Svg';

import { GetActivityFlowTabs } from './BuilderActivityFlow.types';

export const getActivityFlowTabs: GetActivityFlowTabs = (
  { appletId, activityFlowId },
  { hasAboutActivityFlowErrors, hasActivityFlowBuilderErrors },
) => [
  {
    labelKey: 'aboutActivityFlow',
    id: 'about-activity-flow',
    icon: <Svg id="more-info-outlined" />,
    activeIcon: <Svg id="more-info-filled" />,
    path: generatePath(page.builderAppletActivityFlowItemAbout, { appletId, activityFlowId }),
    hasError: hasAboutActivityFlowErrors,
    'data-testid': 'builder-tab-about-activity-flow',
  },
  {
    labelKey: 'activityFlowBuilder',
    id: 'activity-flow-builder',
    icon: <Svg id="checklist-outlined" />,
    activeIcon: <Svg id="checklist-filled" />,
    path: generatePath(page.builderAppletActivityFlowItemBuilder, { appletId, activityFlowId }),
    hasError: hasActivityFlowBuilderErrors,
    'data-testid': 'builder-tab-activity-flow-builder',
  },
  {
    labelKey: 'activityFlowSettings',
    id: 'activity-flow-settings',
    icon: <Svg id="settings" />,
    activeIcon: <Svg id="settings-filled" />,
    path: generatePath(page.builderAppletActivityFlowItemSettings, { appletId, activityFlowId }),
    'data-testid': 'builder-tab-activity-flow-settings',
  },
];
