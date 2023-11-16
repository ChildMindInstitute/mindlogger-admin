import { useEffect } from 'react';

import { Mixpanel } from 'shared/utils/mixpanel';

import { SignUpForm } from '../../features/SignUp/SignUpForm';

export const SignUp = () => {
  useEffect(() => {
    Mixpanel.trackPageView('Create Account');
  }, []);

  return <SignUpForm />;
};
