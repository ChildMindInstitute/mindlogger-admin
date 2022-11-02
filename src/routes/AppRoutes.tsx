import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Login } from 'pages/Login';
import { ResetPassword } from 'pages/ResetPassword';
import { AuthLayout } from 'components/AuthLayout';
import { SignUp } from 'pages/SignUp';
import { Dashboard } from 'pages/Dashboard';
import { useAppDispatch } from 'redux/store';
import { auth } from 'redux/modules';

import { PrivateRoute } from './PrivateRoute';

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
          <Route
            path="/auth"
            element={
              <PrivateRoute condition={!isAuthorized} redirectPath="/">
                <Login />
              </PrivateRoute>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <PrivateRoute condition={!isAuthorized} redirectPath="/">
                <SignUp />
              </PrivateRoute>
            }
          />
          <Route
            path="/auth/reset-password"
            element={
              <PrivateRoute condition={!isAuthorized} redirectPath="/">
                <ResetPassword />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};
