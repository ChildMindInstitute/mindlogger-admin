import { Navigate, useLocation } from 'react-router-dom';

import { page } from 'resources';

type PrivateRouteDefinition = {
  condition: boolean;
  redirectPath?: string;
  children: JSX.Element;
};

export const PrivateRoute = ({
  condition,
  redirectPath = page.login,
  children,
}: PrivateRouteDefinition) => {
  const location = useLocation();
  const redirect = location?.state?.from || redirectPath;

  return condition ? children : <Navigate to={redirect} />;
};
