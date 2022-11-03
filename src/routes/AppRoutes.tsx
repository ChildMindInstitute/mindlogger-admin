import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AuthLayout } from 'components/AuthLayout';
import { Dashboard } from 'pages/Dashboard';
import { useAppDispatch } from 'redux/store';
import { auth } from 'redux/modules';

import { PrivateRoute } from './PrivateRoute';
import { authRoutes } from './routesList';

export const AppRoutes = () => {
  const dispatch = useAppDispatch();
  const token = sessionStorage.getItem('accessToken');
  const isAuthorized = auth.useAuthorized();

  useEffect(() => {
    if (token) {
      dispatch(auth.thunk.signInWithToken({ token }));
    }
  }, [token, dispatch]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute condition={isAuthorized}>
              <Navigate to="/dashboard" replace />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute condition={isAuthorized}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/auth" element={<AuthLayout />}>
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
    </>
  );
};
