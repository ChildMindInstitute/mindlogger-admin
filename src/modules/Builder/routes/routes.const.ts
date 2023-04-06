import { lazy } from 'react';

import { Path } from 'shared/utils';

const Activities = lazy(() => import('modules/Builder/features/Activities'));
const AboutApplet = lazy(() => import('modules/Builder/features/AboutApplet'));
const ActivityAbout = lazy(() => import('modules/Builder/features/ActivityAbout'));
const ActivityItems = lazy(() => import('modules/Builder/features/ActivityItems'));
const ActivityFlowAbout = lazy(() => import('modules/Builder/features/ActivityFlowAbout'));
const ActivityFlow = lazy(() => import('modules/Builder/features/ActivityFlow'));
const ActivityFlowBuilder = lazy(() => import('modules/Builder/features/ActivityFlowBuilder'));

export const appletRoutes = [
  { path: Path.About, Component: AboutApplet },
  { path: Path.Activities, Component: Activities },
  { path: Path.ActivityFlow, Component: ActivityFlow },
];

export const appletActivityRoutes = [
  { path: Path.About, Component: ActivityAbout },
  { path: Path.Items, Component: ActivityItems },
  { path: Path.ItemsFlow },
];

export const appletActivityFlowRoutes = [
  { path: Path.About, Component: ActivityFlowAbout },
  { path: Path.FlowBuilder, Component: ActivityFlowBuilder },
];
