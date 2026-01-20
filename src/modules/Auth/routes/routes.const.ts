import { lazy } from 'react';

import { page } from 'resources';

const Login = lazy(() => import('../pages/Login'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const SignUp = lazy(() => import('../pages/SignUp'));
const RecoverPassword = lazy(() => import('../pages/RecoverPassword'));
const MFAVerify = lazy(() => import('../pages/MFAVerify'));
const MFARecovery = lazy(() => import('../pages/MFARecovery'));

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
  {
    path: page.verifyMFA,
    Component: MFAVerify,
  },
  {
    path: page.verifyRecovery,
    Component: MFARecovery,
  },
];
