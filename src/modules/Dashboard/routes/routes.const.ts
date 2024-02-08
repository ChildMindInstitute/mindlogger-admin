import { lazy } from 'react';

import { page } from 'resources';

const Applets = lazy(() => import('modules/Dashboard/features/Applets'));
const Managers = lazy(() => import('modules/Dashboard/features/Managers'));
const Respondents = lazy(() => import('modules/Dashboard/features/Respondents'));
const AddUser = lazy(() => import('modules/Dashboard/features/Applet/AddUser'));
const Schedule = lazy(() => import('modules/Dashboard/features/Applet/Schedule'));
const AppletSettings = lazy(() => import('modules/Dashboard/features/Applet/DashboardAppletSettings'));

export const mainRoutes = [
  {
    path: page.dashboardApplets,
    Component: Applets,
  },
  {
    path: page.dashboardManagers,
    Component: Managers,
  },
  {
    path: page.dashboardRespondents,
    Component: Respondents,
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
    path: page.appletScheduleIndividual,
    Component: Schedule,
  },
  {
    path: page.appletSettings,
    Component: AppletSettings,
  },
  {
    path: page.appletSettingsItem,
    Component: AppletSettings,
  },
  {
    path: page.appletAddUser,
    Component: AddUser,
  },
];
