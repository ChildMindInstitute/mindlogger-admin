import { lazy, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { BaseLayout } from 'layouts/BaseLayout';
import { AuthLayout } from 'layouts/AuthLayout';
import { useAppDispatch } from 'redux/store';
import { auth } from 'redux/modules';
import { page } from 'resources';
import storage from 'utils/storage';
import { dashBoardRoutes } from 'modules/Dashboard/routes';
import { builderRoutes } from 'modules/Builder/routes';
import { libraryRoutes } from 'modules/Library/routes';

import { PrivateRoute } from './PrivateRoute';
import { authRoutes } from './routes.const';

const Lock = lazy(() => import('pages/Lock'));

export default () => {
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
      {loaded && (
        <Routes>
          <Route element={<BaseLayout />}>
            {dashBoardRoutes()}
            {builderRoutes()}
            {libraryRoutes()}
          </Route>
          <Route path={page.login} element={<AuthLayout />}>
            {authRoutes.map(({ path, Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <PrivateRoute isAuthRoute redirectPath="/">
                    <Component />
                  </PrivateRoute>
                }
              />
            ))}
            <Route
              key={page.lock}
              path={page.lock}
              element={
                // TODO: supplement the condition
                <PrivateRoute isAuthRoute redirectPath="/">
                  <Lock />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to={page.dashboard} replace />} />
        </Routes>
      )}
    </>
  );
};
