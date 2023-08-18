import { useEffect } from 'react';

import { Mixpanel } from 'shared/utils';

import { LoginForm } from '../../features/Login/LoginForm';

export const Login = () => {
  useEffect(() => {
    Mixpanel.trackPageView('Login');
  }, []);

  return <LoginForm />;
};
