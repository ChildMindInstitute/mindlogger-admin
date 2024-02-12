import { Navigate } from 'react-router-dom';

import { page } from 'resources';
import { auth } from 'redux/modules';

type PrivateRouteProps = {
  children: JSX.Element;
};

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuthorized = auth.useAuthorized();

  return isAuthorized ? children : <Navigate to={page.login} />;
};
