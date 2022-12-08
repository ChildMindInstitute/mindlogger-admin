import { useNavigate, useParams } from 'react-router-dom';

import { Svg } from 'components/Svg';
import { RespondentsTable, ManagersTable } from 'components/Tables';
import { Schedule } from 'components/Schedule';
import { More } from 'pages/Applet/More';
import { appletPages } from 'utils/constants';

export const useAppletTabs = () => {
  const { id } = useParams();
  const history = useNavigate();
  const { respondents, managers, more, schedule } = appletPages;

  return [
    {
      labelKey: 'respondents',
      icon: <Svg id="respondent-outlined" />,
      activeIcon: <Svg id="respondent-filled" />,
      content: <RespondentsTable />,
      onClick: () => history(`/${id}/${respondents}`),
    },
    {
      labelKey: 'managers',
      icon: <Svg id="manager-outlined" />,
      activeIcon: <Svg id="manager-filled" />,
      content: <ManagersTable />,
      onClick: () => history(`/${id}/${managers}`),
    },
    {
      labelKey: 'schedule',
      icon: <Svg id="schedule-outlined" />,
      activeIcon: <Svg id="schedule-filled" />,
      content: <Schedule />,
      onClick: () => history(`/${id}/${schedule}`),
    },
    {
      labelKey: 'more',
      icon: <Svg id="dots" />,
      activeIcon: <Svg id="dots-filled" />,
      content: <More />,
      onClick: () => history(`/${id}/${more}`),
    },
  ];
};
