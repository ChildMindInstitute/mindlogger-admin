import { useParams } from 'react-router-dom';

import { Svg } from 'shared/components';
import { APPLET_PAGES } from 'consts';
import { page } from 'resources';

export const useAppletTabs = () => {
  const { id } = useParams();
  const { respondents, managers, addUser, settings, schedule } = APPLET_PAGES;

  return [
    {
      labelKey: 'respondents',
      icon: <Svg id="respondent-outlined" />,
      activeIcon: <Svg id="respondent-filled" />,
      path: `${page.dashboard}/${id}/${respondents}`,
    },
    {
      labelKey: 'managers',
      icon: <Svg id="manager-outlined" />,
      activeIcon: <Svg id="manager-filled" />,
      path: `${page.dashboard}/${id}/${managers}`,
    },
    {
      labelKey: 'addUsers',
      icon: <Svg id="add-users-outlined" />,
      activeIcon: <Svg id="add-users-filled" />,
      isMinHeightAuto: true,
      path: `${page.dashboard}/${id}/${addUser}`,
    },
    {
      labelKey: 'generalSchedule',
      icon: <Svg id="schedule-outlined" />,
      activeIcon: <Svg id="schedule-filled" />,
      path: `${page.dashboard}/${id}/${schedule}`,
    },
    {
      labelKey: 'appletSettings',
      icon: <Svg id="settings" />,
      activeIcon: <Svg id="settings-filled" />,
      path: `${page.dashboard}/${id}/${settings}`,
    },
  ];
};
