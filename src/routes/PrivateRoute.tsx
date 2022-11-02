import { Navigate } from 'react-router-dom';

type PrivateRouteDefinition = {
  condition: boolean;
  redirectPath?: string;
  children: JSX.Element;
};

export const PrivateRoute = ({
  condition,
  redirectPath = '/auth',
  children,
}: PrivateRouteDefinition) => (condition ? children : <Navigate to={redirectPath} />);
