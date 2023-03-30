import { lazy } from 'react';

import { page } from 'resources';

const BuilderAppletSettings = lazy(() => import('modules/Builder/features/BuilderAppletSettings'));
const Activities = lazy(() => import('modules/Builder/features/Activities'));
const AboutApplet = lazy(() => import('modules/Builder/features/AboutApplet'));
const ActivityAbout = lazy(() => import('modules/Builder/features/ActivityAbout'));
const ActivityItems = lazy(() => import('modules/Builder/features/ActivityItems'));
const ActivityFlowAbout = lazy(() => import('modules/Builder/features/ActivityFlowAbout'));
const ActivityFlow = lazy(() => import('modules/Builder/features/ActivityFlow'));
const ActivityFlowBuilder = lazy(() => import('modules/Builder/features/ActivityFlowBuilder'));
const ActivitySettings = lazy(() => import('modules/Builder/features/ActivitySettings'));

export const newAppletRoutes = [
  { path: page.newAppletAbout, Component: AboutApplet },
  { path: page.newAppletActivities, Component: Activities },
  { path: page.newAppletActivityFlow, Component: ActivityFlow },
  { path: page.newAppletSettings, Component: BuilderAppletSettings },
  {
    path: page.newAppletSettingsItem,
    Component: BuilderAppletSettings,
  },
];

export const newAppletNewActivityRoutes = [
  { path: page.newAppletNewActivityAbout, Component: ActivityAbout },
  { path: page.newAppletNewActivityItems, Component: ActivityItems },
  { path: page.newAppletNewActivityItemFlow },
  { path: page.newAppletNewActivitySettings, Component: ActivitySettings },
  { path: page.newAppletNewActivitySettingsItem, Component: ActivitySettings },
];

export const newAppletNewActivityFlowRoutes = [
  { path: page.newAppletNewActivityFlowAbout, Component: ActivityFlowAbout },
  { path: page.newAppletNewActivityFlowBuilder, Component: ActivityFlowBuilder },
];
