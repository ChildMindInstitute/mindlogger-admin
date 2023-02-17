import { Svg } from 'components';
import { page } from 'resources';

export const newActivityFlowTabs = [
  {
    labelKey: 'aboutActivityFlow',
    icon: <Svg id="more-info-outlined" />,
    activeIcon: <Svg id="more-info-filled" />,
    path: page.newAppletNewActivityFlowAbout,
  },
  {
    labelKey: 'activityFlowBuilder',
    icon: <Svg id="checklist-outlined" />,
    activeIcon: <Svg id="checklist-filled" />,
    path: page.newAppletNewActivityFlowBuilder,
  },
];
