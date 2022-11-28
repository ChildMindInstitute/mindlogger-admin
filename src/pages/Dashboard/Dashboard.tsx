import { useEffect } from 'react';

import { page } from 'resources';
import { useAppDispatch } from 'redux/store';
import { auth, account, breadcrumbs, users } from 'redux/modules';
import { Tabs } from 'components/Tabs';
import { StyledBody } from 'styles/styledComponents/Body';

import { dashboardTabs } from './Dashboard.const';

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const authData = auth.useData();
  const accountData = account.useData();

  useEffect(() => {
    if (authData) {
      const { firstName, lastName } = authData.user;
      dispatch(
        breadcrumbs.actions.setBreadcrumbs([
          {
            label: `${firstName}${lastName ? ` ${lastName}` : ''}'s Dashboard`,
            navPath: page.dashboard,
          },
        ]),
      );
    }
  }, [dispatch, authData]);

  useEffect(() => {
    if (accountData?.account) {
      dispatch(account.thunk.getAppletsForFolders({ account: accountData?.account }));
    }
  }, [dispatch, accountData?.account]);

  return (
    <StyledBody>
      <Tabs tabs={dashboardTabs} />
    </StyledBody>
  );
};
