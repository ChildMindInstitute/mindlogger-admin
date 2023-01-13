import { Svg } from 'components';
import { Applets } from 'features/Applets';
import { Managers } from 'features/Managers';
import { Respondents } from 'features/Respondents';

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
