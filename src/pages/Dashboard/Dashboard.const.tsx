import { AppletsTable } from 'components/AppletsTable';
import { ManagersTable } from 'components/ManagersTable';
import { RespondentsTable } from 'components/RespondentsTable';
import { Svg } from 'components/Svg';

export const dashboardTabs = [
  {
    labelKey: 'applets',
    icon: <Svg id="applet-outlined" />,
    activeIcon: <Svg id="applet-filled" />,
    content: <AppletsTable />,
  },
  {
    labelKey: 'managers',
    icon: <Svg id="manager-outlined" />,
    activeIcon: <Svg id="manager-filled" />,
    content: <ManagersTable />,
  },
  {
    labelKey: 'respondents',
    icon: <Svg id="respondent-outlined" />,
    activeIcon: <Svg id="respondent-filled" />,
    content: <RespondentsTable />,
  },
];
