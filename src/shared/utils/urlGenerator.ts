import { matchPath, generatePath } from 'react-router-dom';

import { PerformanceTasks } from 'modules/Builder/features/Activities/Activities.types';
import { page } from 'resources';

export const enum Path {
  Auth = 'auth',
  Dashboard = 'dashboard',
  Builder = 'builder',
  NewApplet = 'new-applet',
  NewActivityFlow = 'new-activity-flow',
  About = 'about',
  Activities = 'activities',
  Items = 'items',
  ItemsFlow = 'item-flow',
  Settings = 'settings',
  ActivityFlow = 'activity-flow',
  FlowBuilder = 'builder',
  Flanker = 'flanker',
  PerformanceTask = 'performance-task',
  Gyroscope = 'gyroscope',
  Touch = 'touch',
}

const uuidRegexp = '([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})';
export const APPLET_PAGE_REGEXP_STRING = `\\/${Path.Builder}\\/(${uuidRegexp}|${Path.NewApplet})`;
export const ACTIVITIES_PAGE_REGEXP_STRING = `${APPLET_PAGE_REGEXP_STRING}\\/${Path.Activities}`;
export const ACTIVITY_FLOWS_PAGE_REGEXP_STRING = `${APPLET_PAGE_REGEXP_STRING}\\/${Path.ActivityFlow}`;
export const ACTIVITY_PAGE_REGEXP_STRING = `${ACTIVITIES_PAGE_REGEXP_STRING}\\/(${uuidRegexp})`;
export const PERFORMANCE_TASK_PAGE_REGEXP_STRING = `${ACTIVITIES_PAGE_REGEXP_STRING}\\/${Path.PerformanceTask}\\/${Path.Flanker}|${Path.Gyroscope}|${Path.Touch}/(${uuidRegexp})`;
export const ACTIVITY_FLOW_PAGE_REGEXP_STRING = `${ACTIVITY_FLOWS_PAGE_REGEXP_STRING}\\/(${uuidRegexp})`;

export const getAppletPageRegexp = (path?: string) =>
  path ? `${APPLET_PAGE_REGEXP_STRING}\\/${path}` : APPLET_PAGE_REGEXP_STRING;
export const getAppletActivityPageRegexp = (path?: string) =>
  path ? `${ACTIVITY_PAGE_REGEXP_STRING}\\/${path}` : ACTIVITY_PAGE_REGEXP_STRING;
export const getAppletActivityFlowPageRegexp = (path?: string) =>
  path ? `${ACTIVITY_FLOW_PAGE_REGEXP_STRING}\\/${path}` : ACTIVITY_PAGE_REGEXP_STRING;
export const getAppletPerformanceActivityPageRegexp = (path: string) =>
  `${ACTIVITIES_PAGE_REGEXP_STRING}\\/${Path.PerformanceTask}\\/${path}/(${uuidRegexp})`;

export const getBuilderAppletUrl = (id: string) => `/${Path.Builder}/${id}`;

export const getUpdatedAppletUrl = (appletId: string, entityId: string, url: string) => {
  const matchedPath =
    [
      page.builderAppletFlanker,
      page.builderAppletGyroscope,
      page.builderAppletTouch,
      page.builderAppletActivity,
      page.builderAppletActivityFlowItem,
      page.builderApplet,
    ].find((pattern) => matchPath(`${pattern}/*`, url)) ?? '';

  const match = matchPath(`${matchedPath}/*`, url);

  if (!match) return url;

  return generatePath(match.pattern.path, {
    ...match?.params,
    appletId,
    activityId: entityId,
    activityFlowId: entityId,
  });
};

export const checkIfAppletUrlPassed = (url: string) =>
  new RegExp(`^${APPLET_PAGE_REGEXP_STRING}`).test(url);

export const checkIfAppletActivityUrlPassed = (url: string) =>
  new RegExp(`^${ACTIVITY_PAGE_REGEXP_STRING}`).test(url);

export const checkIfPerformanceTaskUrlPassed = (url: string) =>
  new RegExp(`^${PERFORMANCE_TASK_PAGE_REGEXP_STRING}`).test(url);

export const checkIfAppletActivityFlowUrlPassed = (url: string) =>
  new RegExp(`^${ACTIVITY_FLOW_PAGE_REGEXP_STRING}`).test(url);

export const checkCurrentPerformanceTaskPage = (url: string) => ({
  [PerformanceTasks.Flanker]: new RegExp(
    `${getAppletPerformanceActivityPageRegexp(Path.Flanker)}`,
  ).test(url),
  [PerformanceTasks.Gyroscope]: new RegExp(
    `${getAppletPerformanceActivityPageRegexp(Path.Gyroscope)}`,
  ).test(url),
  [PerformanceTasks.Touch]: new RegExp(
    `${getAppletPerformanceActivityPageRegexp(Path.Touch)}`,
  ).test(url),
});

export const checkCurrentActivityPage = (url: string) => ({
  isAbout: new RegExp(`${getAppletActivityPageRegexp(Path.About)}`).test(url),
  isItems: new RegExp(`${getAppletActivityPageRegexp(Path.Items)}`).test(url),
  isItemsFlow: new RegExp(`${getAppletActivityPageRegexp(Path.ItemsFlow)}`).test(url),
  isActivitySettings: new RegExp(`${getAppletActivityPageRegexp(Path.Settings)}`).test(url),
});

export const checkCurrentActivityFlowPage = (url: string) => ({
  isAbout: new RegExp(`${getAppletActivityFlowPageRegexp(Path.About)}`).test(url),
  isBuilder: new RegExp(`${getAppletActivityFlowPageRegexp(Path.FlowBuilder)}`).test(url),
});

export const isNewApplet = (appletId?: string) => appletId === Path.NewApplet;
