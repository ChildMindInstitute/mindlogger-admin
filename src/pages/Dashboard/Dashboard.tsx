import { useEffect } from 'react';
import { t } from 'i18next';
import { Box } from '@mui/material';

import { page } from 'resources';
import { useAppDispatch } from 'redux/store';
import { auth, breadcrumbs } from 'redux/modules';
import { Tabs } from 'components/Tabs';
import { Search } from 'components/Search';

import { StyledDashboard } from './Dashboard.styles';

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const userData = auth.useUserData();

  useEffect(() => {
    if (userData) {
      dispatch(
        breadcrumbs.actions.setBreadcrumbs([
          {
            label: `${userData.firstName} ${userData.lastName}'s Mindlogger`,
            navPath: page.dashboard,
          },
        ]),
      );
    }
  }, [dispatch, userData]);

  return (
    <StyledDashboard>
      <Tabs />
      <Box>
        <Search placeholder={t('searchApplets')} />
      </Box>
    </StyledDashboard>
  );
};
