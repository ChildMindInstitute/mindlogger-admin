import { useEffect } from 'react';

import { page } from 'resources';
import { useAppDispatch } from 'redux/store';
import { auth, breadcrumbs, users } from 'redux/modules';
import { Tabs } from 'components/Tabs';

import { StyledDashboard } from './Dashboard.styles';

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const authData = auth.useData();

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
    dispatch(users.thunk.getManagersList());
    dispatch(users.thunk.getUsersList());
  }, [dispatch]);

  return (
    <StyledDashboard>
      <Tabs />
    </StyledDashboard>
  );
};
