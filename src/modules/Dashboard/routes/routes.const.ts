import { lazy } from 'react';

import { Managers } from 'modules/Dashboard/features/Managers';
import { Respondents } from 'modules/Dashboard/features/Respondents';
import { page } from 'resources';

const AddUser = lazy(() => import('modules/Dashboard/features/Applet/AddUser'));
const Schedule = lazy(() => import('modules/Dashboard/features/Applet/Schedule'));
const AppletSettings = lazy(
  () => import('modules/Dashboard/features/Applet/DashboardAppletSettings'),
);

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
    path: page.appletSettingsItem,
    Component: AppletSettings,
  },
  {
    path: page.appletAddUser,
    Component: AddUser,
  },
];
