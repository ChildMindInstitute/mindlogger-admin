import { useParams } from 'react-router-dom';

import { Svg } from 'components/Svg';
import { appletPages } from 'utils/constants';

export const useAppletTabs = () => {
  const { id } = useParams();
  const { respondents, managers, more, schedule } = appletPages;

  return [
    {
      labelKey: 'respondents',
      icon: <Svg id="respondent-outlined" />,
      activeIcon: <Svg id="respondent-filled" />,
      path: `/${id}/${respondents}`,
    },
    {
      labelKey: 'managers',
      icon: <Svg id="manager-outlined" />,
      activeIcon: <Svg id="manager-filled" />,
      path: `/${id}/${managers}`,
    },
    {
      labelKey: 'schedule',
      icon: <Svg id="schedule-outlined" />,
      activeIcon: <Svg id="schedule-filled" />,
      path: `/${id}/${schedule}`,
    },
    {
      labelKey: 'more',
      icon: <Svg id="dots" />,
      activeIcon: <Svg id="dots-filled" />,
      isMinHeightAuto: true,
      path: `/${id}/${more}`,
    },
  ];
};
