import { Navigate } from 'react-router-dom';

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
}: PrivateRouteDefinition) => (condition ? children : <Navigate to={redirectPath} />);
