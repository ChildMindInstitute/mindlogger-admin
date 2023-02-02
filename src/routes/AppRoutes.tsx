import { lazy, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { BaseLayout } from 'layouts/BaseLayout';
import { AuthLayout } from 'layouts/AuthLayout';
import { useAppDispatch } from 'redux/store';
import { auth } from 'redux/modules';
import { page } from 'resources';
import storage from 'utils/storage';

import { PrivateRoute } from './PrivateRoute';
import { appletRoutes, authRoutes, newAppletRoutes } from './routes.const';

const Dashboard = lazy(() => import('pages/Dashboard'));
const Applet = lazy(() => import('pages/Applet'));
const Builder = lazy(() => import('pages/Builder'));
const NewApplet = lazy(() => import('pages/NewApplet'));

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
      {loaded && (
        <Routes>
          <Route element={<BaseLayout />}>
            <Route path={page.dashboard}>
              <Route
                path={page.dashboard}
                element={
                  <PrivateRoute condition={isAuthorized}>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route element={<Applet />}>
                {appletRoutes.map(({ path, Component }) => (
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
            </Route>
            <Route path={page.builder}>
              <Route
                path={page.builder}
                element={
                  <PrivateRoute condition={isAuthorized}>
                    <Builder />
                  </PrivateRoute>
                }
              />
              <Route element={<NewApplet />} path={page.newApplet}>
                {newAppletRoutes.map(({ path }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <PrivateRoute condition={isAuthorized}>
                        <></>
                      </PrivateRoute>
                    }
                  />
                ))}
              </Route>
            </Route>
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
          <Route path="*" element={<Navigate to={page.dashboard} replace />} />
        </Routes>
      )}
    </>
  );
};
