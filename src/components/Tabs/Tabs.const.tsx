import { AppletsTable } from 'components/AppletsTable';
import { ManagersTable } from 'components/ManagersTable';
import { RespondentsTable } from 'components/RespondentsTable';
import { Svg } from 'components/Svg';

export const tabs = [
  {
    labelKey: 'dashboardTabsLabel',
    icon: <Svg id="applet-outlined" />,
    activeIcon: <Svg id="applet-filled" />,
    content: <AppletsTable />,
  },
  {
    labelKey: 'dashboardTabsLabel2',
    icon: <Svg id="manager-outlined" />,
    activeIcon: <Svg id="manager-filled" />,
    content: <ManagersTable />,
  },
  {
    labelKey: 'dashboardTabsLabel3',
    icon: <Svg id="respondent-outlined" />,
    activeIcon: <Svg id="respondent-filled" />,
    content: <RespondentsTable />,
  },
];
