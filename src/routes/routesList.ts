import React from 'react';
import { page } from 'resources';

const Login = React.lazy(() => import('pages/Login'));
const ResetPassword = React.lazy(() => import('pages/ResetPassword'));
const SignUp = React.lazy(() => import('pages/SignUp'));

export const authRoutes = [
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
];
