import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { useAppDispatch } from 'redux/store';
import { auth } from 'redux/modules';
import theme from 'styles/theme';
import { AppRoutes } from 'routes/AppRoutes';

function App() {
  const dispatch = useAppDispatch();
  const token = sessionStorage.getItem('accessToken');
  const isAuthorized = auth.useAuthorized();

  useEffect(() => {
    if (token) {
      dispatch(auth.thunk.loginWithToken({ token }));
    }
  }, [token, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes isAuthorized={isAuthorized} />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
