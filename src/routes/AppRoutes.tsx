import { lazy, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { BaseLayout } from 'layouts/BaseLayout';
import { AuthLayout } from 'layouts/AuthLayout';
import { useAppDispatch } from 'redux/store';
import { auth } from 'redux/modules';
import { page } from 'resources';
import storage from 'utils/storage';

import { PrivateRoute } from './PrivateRoute';
import {
  appletRoutes,
  authRoutes,
  newAppletNewActivityFlowRoutes,
  newAppletNewActivityRoutes,
  newAppletRoutes,
  libraryRoutes,
} from './routes.const';

const Lock = lazy(() => import('pages/Lock'));
const Dashboard = lazy(() => import('pages/Dashboard'));
const Applet = lazy(() => import('pages/Applet'));
const Builder = lazy(() => import('pages/Builder'));
const NewApplet = lazy(() => import('pages/NewApplet'));
const NewActivityFlow = lazy(() => import('pages/NewActivityFlow'));
const NewActivity = lazy(() => import('pages/NewActivity'));

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
                <Route
                  path={page.newApplet}
                  element={<Navigate to={page.newAppletAbout} replace />}
                />
                {newAppletRoutes.map(({ path, Component }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <PrivateRoute condition={isAuthorized}>
                        {Component ? <Component /> : <></>}
                      </PrivateRoute>
                    }
                  />
                ))}
                <Route path={page.newAppletActivities}>
                  <Route element={<NewActivity />} path={page.newAppletNewActivity}>
                    <Route
                      path={page.newAppletNewActivity}
                      element={<Navigate to={page.newAppletNewActivityAbout} replace />}
                    />
                    {newAppletNewActivityRoutes.map(({ path, Component }) => (
                      <Route
                        key={path}
                        path={path}
                        element={
                          <PrivateRoute condition={isAuthorized}>
                            {Component ? <Component /> : <></>}
                          </PrivateRoute>
                        }
                      />
                    ))}
                  </Route>
                </Route>
                <Route path={page.newAppletActivityFlow}>
                  <Route element={<NewActivityFlow />} path={page.newAppletNewActivityFlow}>
                    <Route
                      path={page.newAppletNewActivityFlow}
                      element={<Navigate to={page.newAppletNewActivityFlowAbout} replace />}
                    />
                    {newAppletNewActivityFlowRoutes.map(({ path, Component }) => (
                      <Route
                        key={path}
                        path={path}
                        element={
                          <PrivateRoute condition={isAuthorized}>
                            {Component ? <Component /> : <></>}
                          </PrivateRoute>
                        }
                      />
                    ))}
                  </Route>
                </Route>
              </Route>
            </Route>
            <Route path={page.library}>
              {libraryRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
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
            <Route
              key={page.lock}
              path={page.lock}
              element={
                // TODO: supplement the condition
                <PrivateRoute condition={isAuthorized} redirectPath="/">
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
