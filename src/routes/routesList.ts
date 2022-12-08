import { lazy } from 'react';

import { page } from 'resources';

const Login = lazy(() => import('pages/Login'));
const ResetPassword = lazy(() => import('pages/ResetPassword'));
const SignUp = lazy(() => import('pages/SignUp'));
const Dashboard = lazy(() => import('pages/Dashboard'));
const Applet = lazy(() => import('pages/Applet'));

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

export const dashboardRoutes = [
  {
    path: page.dashboard,
    Component: Dashboard,
  },
  ...[
    page.appletRespondents,
    page.appletManagers,
    page.appletSchedule,
    page.appletMore,
    page.appletAddUser,
  ].map((path) => ({
    path,
    Component: Applet,
  })),
];
