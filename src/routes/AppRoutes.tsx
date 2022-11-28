import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AuthLayout } from 'layouts/AuthLayout';
import { useAppDispatch } from 'redux/store';
import { auth } from 'redux/modules';
import { page } from 'resources';

import { BaseLayout } from 'layouts/BaseLayout';

import { PrivateRoute } from './PrivateRoute';
import { authRoutes, dashboardRoutes } from './routesList';

export const AppRoutes = () => {
  const token = sessionStorage.getItem('accessToken');

  const [loaded, setLoaded] = useState(!token);
  const dispatch = useAppDispatch();
  const isAuthorized = auth.useAuthorized();
  const status = auth.useStatus();

  useEffect(() => {
    if (status === 'error' || status === 'success') {
      setLoaded(true);
    }
  }, [status]);

  useEffect(() => {
    if (!isAuthorized && token) {
      dispatch(auth.thunk.signInWithToken({ token }));
    }
  }, [isAuthorized, token, dispatch]);

  return (
    <>
      {loaded && (
        <Routes>
          <Route path={page.dashboard} element={<BaseLayout />}>
            {dashboardRoutes.map(({ path, Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <PrivateRoute condition={isAuthorized}>
                    <Component />
                  </PrivateRoute>
                }
              />
            ))}
          </Route>
          <Route path={page.login} element={<AuthLayout />}>
            {authRoutes.map(({ path, Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <PrivateRoute condition={!isAuthorized} redirectPath="/">
                    <Component />
                  </PrivateRoute>
                }
              />
            ))}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </>
  );
};
