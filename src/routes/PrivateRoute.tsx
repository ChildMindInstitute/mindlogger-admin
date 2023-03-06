import { Navigate } from 'react-router-dom';

import { page } from 'resources';
import { auth } from 'redux/modules';

type PrivateRouteDefinition = {
  isAuthRoute?: boolean;
  redirectPath?: string;
  children: JSX.Element;
};

export const PrivateRoute = ({
  isAuthRoute,
  redirectPath = page.login,
  children,
}: PrivateRouteDefinition) => {
  const isAuthorized = auth.useAuthorized();

  if (isAuthorized || (!isAuthorized && isAuthRoute)) {
    return children;
  }

  return <Navigate to={redirectPath} />;
};
