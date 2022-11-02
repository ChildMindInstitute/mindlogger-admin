import { Box, Button, Typography } from '@mui/material';

import { useAppDispatch } from 'redux/store';
import { auth } from 'redux/modules';

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
      <Button variant="contained" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};
