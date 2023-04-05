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
  },
  {
    labelKey: 'activityFlowBuilder',
    icon: <Svg id="checklist-outlined" />,
    activeIcon: <Svg id="checklist-filled" />,
    path: generatePath(page.builderAppletActivityFlowItemBuilder, { appletId, activityFlowId }),
  },
];
