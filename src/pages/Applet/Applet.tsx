import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { page } from 'resources';
import { useAppDispatch } from 'redux/store';
import { auth, breadcrumbs, account, users } from 'redux/modules';
import { Tabs } from 'components/Tabs';
import { StyledBody } from 'styles/styledComponents/Body';
import { Svg } from 'components/Svg';
import { RespondentsTable } from 'components/RespondentsTable';
import { ManagersTable } from 'components/ManagersTable';
import { Spinner } from 'components/Spinner';
import { More } from 'components/More';

import { getAppletName } from './Applet.utils';

export const Applet = (): JSX.Element => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const authData = auth.useData();
  const appletsFoldersData = account.useFoldersApplets();
  const usersData = users.useUserData();
  const userMetaStatus = users.useUserMetaStatus();
  const managerMetaStatus = users.useManagerMetaStatus();

  const appletTabs = [
    ...(id && usersData?.items.some((user) => user[id])
      ? [
          {
            labelKey: 'appletTabsLabel',
            icon: <Svg id="respondent-outlined" />,
            activeIcon: <Svg id="respondent-filled" />,
            content: <RespondentsTable />,
          },
        ]
      : []),
    {
      labelKey: 'appletTabsLabel2',
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

  useEffect(() => {
    if (authData && appletsFoldersData) {
      const { firstName, lastName } = authData.user;
      const appletName = getAppletName(appletsFoldersData, id);

      dispatch(
        breadcrumbs.actions.setBreadcrumbs([
          {
            label: `${firstName}${lastName ? ` ${lastName}` : ''}'s Dashboard`,
            navPath: page.dashboard,
          },
          {
            label: appletName || '',
            navPath: page.applet,
          },
        ]),
      );
    }
  }, [dispatch, authData, appletsFoldersData, id]);

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
