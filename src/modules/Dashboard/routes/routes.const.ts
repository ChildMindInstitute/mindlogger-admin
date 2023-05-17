import { lazy } from 'react';

import { Applets } from 'modules/Dashboard/features/Applets';
import { Managers } from 'modules/Dashboard/features/Managers';
import { Respondents } from 'modules/Dashboard/features/Respondents';
import { page } from 'resources';
import { Roles } from 'shared/consts';

const AddUser = lazy(() => import('modules/Dashboard/features/Applet/AddUser'));
const Schedule = lazy(() => import('modules/Dashboard/features/Applet/Schedule'));
const AppletSettings = lazy(
  () => import('modules/Dashboard/features/Applet/DashboardAppletSettings'),
);

export const mainRoutes = [
  {
    path: page.dashboardApplets,
    Component: Applets,
  },
  {
    path: page.dashboardManagers,
    Component: Managers,
    forbiddenRoles: [Roles.Reviewer, Roles.Coordinator, Roles.Editor],
  },
  {
    path: page.dashboardRespondents,
    Component: Respondents,
    forbiddenRoles: [Roles.Editor],
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
    forbiddenRoles: [Roles.Reviewer, Roles.Coordinator, Roles.Respondent],
  },
  {
    path: page.appletSchedule,
    Component: Schedule,
    forbiddenRoles: [Roles.Reviewer],
  },
  {
    path: page.appletScheduleIndividual,
    Component: Schedule,
    forbiddenRoles: [Roles.Reviewer],
  },
  {
    path: page.appletSettings,
    Component: AppletSettings,
    forbiddenRoles: [Roles.Reviewer, Roles.Coordinator],
  },
  {
    path: page.appletSettingsItem,
    Component: AppletSettings,
    forbiddenRoles: [Roles.Reviewer, Roles.Coordinator],
  },
  {
    path: page.appletAddUser,
    Component: AddUser,
    forbiddenRoles: [Roles.Reviewer],
  },
];
