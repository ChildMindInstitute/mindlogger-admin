import { useParams } from 'react-router-dom';

import { Tabs } from 'components/Tabs';
import { Svg } from 'components/Svg';
import { RespondentsTable } from 'components/RespondentsTable';
import { ManagersTable } from 'components/ManagersTable';
import { Spinner } from 'components/Spinner';
import { More } from 'components/More';
import { users } from 'redux/modules';
import { StyledBody } from 'styles/styledComponents/Body';

export const Applet = (): JSX.Element => {
  const { id } = useParams();
  const usersData = users.useUserData();
  const userMetaStatus = users.useUserMetaStatus();
  const managerMetaStatus = users.useManagerMetaStatus();

  const appletTabs = [
    ...(id && usersData?.items.some((user) => user[id])
      ? [
          {
            labelKey: 'respondents',
            icon: <Svg id="respondent-outlined" />,
            activeIcon: <Svg id="respondent-filled" />,
            content: <RespondentsTable />,
          },
        ]
      : []),
    {
      labelKey: 'managers',
      icon: <Svg id="manager-outlined" />,
      activeIcon: <Svg id="manager-filled" />,
      content: <ManagersTable />,
    },
    {
      labelKey: 'appletTabsLabel3',
      icon: <Svg id="dots" />,
      activeIcon: <Svg id="dots-filled" />,
      content: <More />,
    },
  ];

  return (
    <StyledBody>
      {userMetaStatus === 'loading' || managerMetaStatus === 'loading' ? (
        <Spinner />
      ) : (
        <Tabs tabs={appletTabs} />
      )}
    </StyledBody>
  );
};
