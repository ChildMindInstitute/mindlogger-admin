import { useEffect } from 'react';

import { page } from 'resources';
import { useAppDispatch } from 'redux/store';
import { auth, account, breadcrumbs, users } from 'redux/modules';
import { Tabs } from 'components/Tabs';

import { StyledDashboard } from './Dashboard.styles';

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
    if (accountData?.account.folders.length) {
      dispatch(account.thunk.getAppletsForFolders({ account: accountData?.account }));
    }
  }, [dispatch, accountData?.account.folders]);

  useEffect(() => {
    dispatch(users.thunk.getManagersList());
    dispatch(users.thunk.getUsersList());
  }, [dispatch]);

  return (
    <StyledDashboard>
      <Tabs />
    </StyledDashboard>
  );
};
