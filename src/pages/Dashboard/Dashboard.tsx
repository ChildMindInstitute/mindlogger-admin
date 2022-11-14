import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

import { page } from 'resources';
import { useAppDispatch } from 'redux/store';
import { auth, breadcrumbs } from 'redux/modules';

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
    <Box style={{ padding: '1rem', textAlign: 'center' }}>
      <Typography variant="h2" gutterBottom>
        Dashboard
      </Typography>
    </Box>
  );
};
