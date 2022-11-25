import { useEffect } from 'react';

import { page } from 'resources';
import { useAppDispatch } from 'redux/store';
import { auth, breadcrumbs } from 'redux/modules';
import { Tabs } from 'components/Tabs';
import { StyledBody } from 'styles/styledComponents/Body';

import { dashboardTabs } from './Dashboard.const';

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
    <StyledBody>
      <Tabs tabs={dashboardTabs} />
    </StyledBody>
  );
};
