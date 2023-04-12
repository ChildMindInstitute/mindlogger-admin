import { generatePath, useParams } from 'react-router-dom';

import { Svg } from 'shared/components';
import { page } from 'resources';

export const useAppletTabs = () => {
  const { appletId } = useParams();

  return [
    {
      labelKey: 'respondents',
      icon: <Svg id="respondent-outlined" />,
      activeIcon: <Svg id="respondent-filled" />,
      path: generatePath(page.appletRespondents, {
        appletId,
      }),
    },
    {
      labelKey: 'managers',
      icon: <Svg id="manager-outlined" />,
      activeIcon: <Svg id="manager-filled" />,
      path: generatePath(page.appletManagers, {
        appletId,
      }),
    },
    {
      labelKey: 'addUsers',
      icon: <Svg id="add-users-outlined" />,
      activeIcon: <Svg id="add-users-filled" />,
      isMinHeightAuto: true,
      path: generatePath(page.appletAddUser, {
        appletId,
      }),
    },
    {
      labelKey: 'generalSchedule',
      icon: <Svg id="schedule-outlined" />,
      activeIcon: <Svg id="schedule-filled" />,
      path: generatePath(page.appletSchedule, {
        appletId,
      }),
    },
    {
      labelKey: 'appletSettings',
      icon: <Svg id="settings" />,
      activeIcon: <Svg id="settings-filled" />,
      path: generatePath(page.appletSettings, {
        appletId,
      }),
    },
  ];
};
