import { lazy, useEffect } from 'react';
import { unstable_HistoryRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { authStorage } from 'shared/utils';
import { dashboardRoutes } from 'modules/Dashboard/routes';
import { builderRoutes } from 'modules/Builder/routes';
import { libraryRoutes } from 'modules/Library/routes';
import { authRoutes } from 'modules/Auth/routes';
import { auth } from 'redux/modules';
import { AppletNotFoundPopup } from 'shared/components';

import history from './history';

const BaseLayout = lazy(() => import('shared/layouts/BaseLayout'));
const AuthLayout = lazy(() => import('modules/Auth/layouts/AuthLayout'));

export const AppRoutes = () => {
  const token = authStorage.getAccessToken();
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
      {/* @ts-expect-error history-router now unstable and it's a known error https://github.com/remix-run/react-router/issues/9630 */}
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
        <AppletNotFoundPopup />
      </Router>
    </>
  );
};
