import { lazy } from 'react';

import { Managers } from 'features/Managers';
import { Respondents } from 'features/Respondents';
import { Schedule } from 'features/Applet/Schedule';
import { page } from 'resources';

const Login = lazy(() => import('pages/Login'));
const ResetPassword = lazy(() => import('pages/ResetPassword'));
const SignUp = lazy(() => import('pages/SignUp'));
const AddUser = lazy(() => import('features/Applet/AddUser'));
const AppletSettings = lazy(() => import('features/Applet/AppletSettings'));

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

export const appletRoutes = [
  {
    path: page.appletRespondents,
    Component: Respondents,
  },
  {
    path: page.appletManagers,
    Component: Managers,
  },
  {
    path: page.appletSchedule,
    Component: Schedule,
  },
  {
    path: page.appletSettings,
    Component: AppletSettings,
  },
  {
    path: page.appletAddUser,
    Component: AddUser,
  },
];
