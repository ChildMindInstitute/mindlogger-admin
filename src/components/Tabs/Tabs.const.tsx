import { AppletsTable } from 'components/AppletsTable';
import { Svg } from 'components/Svg';

export const tabs = [
  { labelKey: 'dashboardTabsLabel', icon: <Svg id="applets" />, content: <AppletsTable /> },
  { labelKey: 'dashboardTabsLabel2', icon: <Svg id="manager" />, content: 'content 2' },
  { labelKey: 'dashboardTabsLabel3', icon: <Svg id="respondent" />, content: 'content 3' },
];
