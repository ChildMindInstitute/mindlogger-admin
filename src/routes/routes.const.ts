import { lazy } from 'react';

import { page } from 'resources';
import { ManagersTable, RespondentsTable } from 'components/Tables';
import { Schedule } from 'features/Schedule';

const Login = lazy(() => import('pages/Login'));
const ResetPassword = lazy(() => import('pages/ResetPassword'));
const SignUp = lazy(() => import('pages/SignUp'));
const AddUser = lazy(() => import('components/AddUser'));
const More = lazy(() => import('pages/Applet/More'));

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
    Component: RespondentsTable,
  },
  {
    path: page.appletManagers,
    Component: ManagersTable,
  },
  {
    path: page.appletSchedule,
    Component: Schedule,
  },
  {
    path: page.appletMore,
    Component: More,
  },
  {
    path: page.appletAddUser,
    Component: AddUser,
  },
];
