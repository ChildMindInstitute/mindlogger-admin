import { Svg } from 'shared/components';
import { Applets } from 'modules/Dashboard/features/Applets';
import { Managers } from 'modules/Dashboard/features/Managers';
import { Respondents } from 'modules/Dashboard/features/Respondents';

export const dashboardTabs = [
  {
    labelKey: 'applets',
    icon: <Svg id="applet-outlined" />,
    activeIcon: <Svg id="applet-filled" />,
    content: <Applets />,
  },
  {
    labelKey: 'managers',
    icon: <Svg id="manager-outlined" />,
    activeIcon: <Svg id="manager-filled" />,
    content: <Managers />,
  },
  {
    labelKey: 'respondents',
    icon: <Svg id="respondent-outlined" />,
    activeIcon: <Svg id="respondent-filled" />,
    content: <Respondents />,
  },
];
