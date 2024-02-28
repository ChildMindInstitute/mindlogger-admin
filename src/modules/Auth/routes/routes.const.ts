import { lazy } from 'react';

import { page } from 'resources';

const Login = lazy(() => import('../pages/Login'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const SignUp = lazy(() => import('../pages/SignUp'));
const RecoverPassword = lazy(() => import('../pages/RecoverPassword'));

export const routes = [
  {
    path: page.login,
    Component: Login,
  },
  {
    path: page.signUp,
    Component: SignUp,
  },
  {
    path: page.passwordReset,
    Component: ResetPassword,
  },
  {
    path: page.passwordRecovery,
    Component: RecoverPassword,
  },
];
