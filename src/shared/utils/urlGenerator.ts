export const enum Path {
  Auth = 'auth',
  Dashboard = 'dashboard',
  Builder = 'builder',
  NewApplet = 'new-applet',
  Activity = ':activityId',
  NewActivityFlow = 'new-activity-flow',
  About = 'about',
  Activities = 'activities',
  Items = 'items',
  ItemsFlow = 'item-flow',
  Settings = 'settings',
  ActivityFlow = 'activity-flow',
  FlowBuilder = 'builder',
}

const uuidRegexp = '([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})';
export const APPLET_PAGE_REGEXP_STRING = `\\/${Path.Builder}\\/(${uuidRegexp}|(${Path.NewApplet}))`;
export const ACTIVITIES_PAGE_REGEXP_STRING = `${APPLET_PAGE_REGEXP_STRING}\\/${Path.Activities}`;
export const ACTIVITY_FLOWS_PAGE_REGEXP_STRING = `${APPLET_PAGE_REGEXP_STRING}\\/${Path.ActivityFlow}`;
export const ACTIVITY_PAGE_REGEXP_STRING = `${ACTIVITIES_PAGE_REGEXP_STRING}\\/(${uuidRegexp}|(${Path.Activity}))`;
export const ACTIVITY_FLOW_PAGE_REGEXP_STRING = `${ACTIVITY_FLOWS_PAGE_REGEXP_STRING}\\/(${uuidRegexp}|(${Path.Activity}))`;

export const getAppletPageRegexp = (path?: string) =>
  path ? `${APPLET_PAGE_REGEXP_STRING}\\/${path}` : APPLET_PAGE_REGEXP_STRING;
export const getAppletActivityPageRegexp = (path?: string) =>
  path ? `${ACTIVITY_PAGE_REGEXP_STRING}\\/${path}` : ACTIVITY_PAGE_REGEXP_STRING;

export const getBuilderAppletUrl = (id: string) => `/${Path.Builder}/${id}`;
export const getBuilderAppletActivityUrl = (appletId: string, activityId: string) =>
  `/${Path.Builder}/${appletId}/${Path.Activities}/${activityId}`;

export const checkIfAppletUrlPassed = (url: string) =>
  new RegExp(`^${APPLET_PAGE_REGEXP_STRING}`).test(url);

export const checkIfAppletActivityFlowUrlPassed = (url: string) =>
  new RegExp(`^${ACTIVITY_FLOW_PAGE_REGEXP_STRING}`).test(url);

export const isNewApplet = (appletId?: string) => appletId === Path.NewApplet;
