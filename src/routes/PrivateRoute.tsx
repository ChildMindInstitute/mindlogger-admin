import { Navigate } from 'react-router-dom';

import { auth } from 'redux/modules';
import { page } from 'resources';

type PrivateRouteProps = {
  children: JSX.Element;
};

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuthorized = auth.useAuthorized();

  return isAuthorized ? children : <Navigate to={page.login} />;
};
