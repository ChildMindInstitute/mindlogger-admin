import { ACTIVITIES_PAGE_REGEXP_STRING } from 'shared/utils';

import { ACTIVITY_LAYER_ROUTES, APPLET_LAYER_ROUTES } from './NewApplet.const';

export const APPLET_LAYER_REGEXP_ROUTES = APPLET_LAYER_ROUTES.map((route) =>
  route === ACTIVITIES_PAGE_REGEXP_STRING ? new RegExp(`^${route}$`) : new RegExp(`^${route}.*`),
);
export const ACTIVITY_LAYER_REGEXP_ROUTES = ACTIVITY_LAYER_ROUTES.map(
  (route) => new RegExp(`^${route}.*`),
);

export const isAppletRoute = (path: string) =>
  APPLET_LAYER_REGEXP_ROUTES.some((route) => route.test(path));
export const isActivityRoute = (path: string) =>
  ACTIVITY_LAYER_REGEXP_ROUTES.some((route) => route.test(path));
