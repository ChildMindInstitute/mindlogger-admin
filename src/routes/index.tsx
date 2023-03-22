import { useEffect } from 'react';
import { unstable_HistoryRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import { BaseLayout } from 'shared/layouts/BaseLayout';
import { AuthLayout } from 'modules/Auth/layouts/AuthLayout';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import storage from 'shared/utils/storage';
import { dashboardRoutes } from 'modules/Dashboard/routes';
import { builderRoutes } from 'modules/Builder/routes';
import { libraryRoutes } from 'modules/Library/routes';
import { authRoutes } from 'modules/Auth/routes';
import { auth } from 'modules/Auth/state';

import history from './history';

export const AppRoutes = () => {
  const token = storage.getItem('accessToken');
  const dispatch = useAppDispatch();
  const isAuthorized = auth.useAuthorized();
  const status = auth.useStatus();
  const loaded = !token || status === 'error' || status === 'success';

  useEffect(() => {
    if (!isAuthorized && token) {
      dispatch(auth.thunk.getUserDetails());
    }
  }, [isAuthorized, token, dispatch]);

  return (
    <>
      <Router history={history}>
        {loaded && (
          <Routes>
            <Route element={<BaseLayout />}>
              {dashboardRoutes()}
              {builderRoutes()}
              {libraryRoutes()}
            </Route>
            {!isAuthorized && (
              <Route path={page.login} element={<AuthLayout />}>
                {authRoutes()}
              </Route>
            )}
            <Route path="*" element={<Navigate to={page.dashboard} replace />} />
          </Routes>
        )}
      </Router>
    </>
  );
};
