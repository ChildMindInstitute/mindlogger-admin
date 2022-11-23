import { AppletsTable } from 'components/AppletsTable';
import { ManagersTable } from 'components/ManagersTable';
import { RespondentsTable } from 'components/RespondentsTable';
import { Svg } from 'components/Svg';

export const tabs = [
  { labelKey: 'dashboardTabsLabel', icon: <Svg id="applets" />, content: <AppletsTable /> },
  { labelKey: 'dashboardTabsLabel2', icon: <Svg id="manager" />, content: <ManagersTable /> },
  { labelKey: 'dashboardTabsLabel3', icon: <Svg id="respondent" />, content: <RespondentsTable /> },
];
