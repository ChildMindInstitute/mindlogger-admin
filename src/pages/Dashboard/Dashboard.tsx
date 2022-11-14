import { Box, Button, Typography } from '@mui/material';
import { t } from 'i18next';

import { useAppDispatch } from 'redux/store';
import { auth } from 'redux/modules';
import { Tabs } from 'components/Tabs';
import { Search } from 'components/Search';

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(auth.actions.resetAuthorization());
  };

  return (
    <Box style={{ padding: '1rem', textAlign: 'center' }}>
      <Typography variant="h2" gutterBottom>
        Dashboard
      </Typography>
      <Tabs />
      <Box>
        <Search placeholder={t('searchApplets')} />
      </Box>
      <Button variant="contained" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};
