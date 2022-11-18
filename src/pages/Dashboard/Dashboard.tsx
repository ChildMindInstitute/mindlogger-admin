import { useEffect } from 'react';

import { page } from 'resources';
import { useAppDispatch } from 'redux/store';
import { auth, breadcrumbs } from 'redux/modules';
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

  return (
    <StyledDashboard>
      <Tabs />
    </StyledDashboard>
  );
};
