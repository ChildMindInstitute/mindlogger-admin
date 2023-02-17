import { lazy } from 'react';

import { Managers } from 'features/Managers';
import { Respondents } from 'features/Respondents';
import { Schedule } from 'features/Applet/Schedule';
import { page } from 'resources';

const Login = lazy(() => import('pages/Login'));
const ResetPassword = lazy(() => import('pages/ResetPassword'));
const SignUp = lazy(() => import('pages/SignUp'));
const AddUser = lazy(() => import('features/Applet/AddUser'));
const DashboardAppletSettings = lazy(() => import('features/Applet/DashboardAppletSettings'));
const BuilderAppletSettings = lazy(() => import('features/Builder/BuilderAppletSettings'));
const Activities = lazy(() => import('features/Builder/Activities'));
const AboutApplet = lazy(() => import('features/Builder/AboutApplet'));
const ActivityFlowAbout = lazy(() => import('features/Builder/ActivityFlowAbout'));
const ActivityFlowBuilder = lazy(() => import('features/Builder/ActivityFlowBuilder'));

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
    Component: DashboardAppletSettings,
  },
  {
    path: page.appletAddUser,
    Component: AddUser,
  },
];

export const newAppletRoutes = [
  { path: page.newAppletAbout, Component: AboutApplet },
  { path: page.newAppletActivities, Component: Activities },
  { path: page.newAppletSettings, Component: BuilderAppletSettings },
  {
    path: page.newAppletSettings,
    Component: BuilderAppletSettings,
  },
];

export const newAppletNewActivityRoutes = [
  { path: page.newAppletNewActivityFlowAbout, Component: ActivityFlowAbout },
  { path: page.newAppletNewActivityFlowBuilder, Component: ActivityFlowBuilder },
];
