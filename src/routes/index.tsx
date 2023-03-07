import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { BaseLayout } from 'shared/layouts/BaseLayout';
import { AuthLayout } from 'modules/Auth/layouts/AuthLayout';
import { useAppDispatch } from 'redux/store';

import { page } from 'resources';
import storage from 'shared/utils/storage';
import { dashBoardRoutes } from 'modules/Dashboard/routes';
import { builderRoutes } from 'modules/Builder/routes';
import { libraryRoutes } from 'modules/Library/routes';
import { authRoutes } from 'modules/Auth/routes';
import { auth } from 'modules/Auth/state';

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
          {!isAuthorized && (
            <Route path={page.login} element={<AuthLayout />}>
              {authRoutes()}
            </Route>
          )}
          <Route path="*" element={<Navigate to={page.dashboard} replace />} />
        </Routes>
      )}
    </>
  );
};
