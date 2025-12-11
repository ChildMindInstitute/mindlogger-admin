import { useEffect } from 'react';

import { Mixpanel } from 'shared/utils/mixpanel';

import { AuthFlow } from '../../features/Login/AuthFlow';

export const Login = () => {
  useEffect(() => {
    Mixpanel.trackPageView('Login');
  }, []);

  return <AuthFlow />;
};
