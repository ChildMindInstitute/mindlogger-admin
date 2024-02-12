import { lazy } from 'react';

import { Path } from 'shared/utils';
import { GyroscopeOrTouch } from 'shared/consts';

const Activities = lazy(() => import('modules/Builder/features/Activities'));
const AboutApplet = lazy(() => import('modules/Builder/features/AboutApplet'));
const ActivityAbout = lazy(() => import('modules/Builder/features/ActivityAbout'));
const ActivityFlowAbout = lazy(() => import('modules/Builder/features/ActivityFlowAbout'));
const ActivityFlow = lazy(() => import('modules/Builder/features/ActivityFlow'));
const ActivityFlowBuilder = lazy(() => import('modules/Builder/features/ActivityFlowBuilder'));
const ActivityItemsFlow = lazy(() => import('modules/Builder/features/ActivityItemsFlow'));
const Flanker = lazy(() => import('modules/Builder/features/PerformanceTasks/Flanker'));
const GyroscopeAndTouch = lazy(() => import('modules/Builder/features/PerformanceTasks/GyroscopeAndTouch'));

export const appletRoutes = [
  { path: Path.About, Component: AboutApplet },
  { path: Path.Activities, Component: Activities },
  { path: Path.ActivityFlow, Component: ActivityFlow },
];

export const appletActivityRoutes = [
  { path: Path.About, Component: ActivityAbout },
  { path: Path.ItemsFlow, Component: ActivityItemsFlow },
];

export const appletActivityFlowRoutes = [
  { path: Path.About, Component: ActivityFlowAbout },
  { path: Path.Builder, Component: ActivityFlowBuilder },
];

export const performanceTasksRoutes = [
  { path: Path.Flanker, Component: Flanker },
  {
    path: Path.Gyroscope,
    Component: GyroscopeAndTouch,
    props: { type: GyroscopeOrTouch.Gyroscope },
  },
  { path: Path.Touch, Component: GyroscopeAndTouch, props: { type: GyroscopeOrTouch.Touch } },
];
