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

export const Applet = (): JSX.Element => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const authData = auth.useData();
  const accData = account.useData();
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
  ];

  useEffect(() => {
    if (authData && accData) {
      const { firstName, lastName } = authData.user;
      const { applets } = accData.account;
      const appletName = applets.find((applet) => applet.id === id)?.name;

      dispatch(
        breadcrumbs.actions.setBreadcrumbs([
          {
            label: `${firstName}${lastName ? ` ${lastName}` : ''}'s Dashboard`,
            navPath: page.dashboard,
          },
          {
            // TODO: get the applet name from the folder when the corresponding
            //  getAppletsInFolderApi endpoint is connected to redux-store
            label: appletName || '',
            navPath: page.applet,
          },
        ]),
      );
    }
  }, [dispatch, authData, accData]);

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
