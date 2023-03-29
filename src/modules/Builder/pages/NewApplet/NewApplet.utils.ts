import { page } from 'resources';

import { ACTIVITY_LAYER_ROUTES, APPLET_LAYER_ROUTES } from './NewApplet.const';

export const APPLET_LAYER_REGEXP_ROUTES = APPLET_LAYER_ROUTES.map((route) =>
  route === page.newAppletActivities ? new RegExp(`^${route}$`) : new RegExp(`^${route}.*`),
);
export const ACTIVITY_LAYER_REGEXP_ROUTES = ACTIVITY_LAYER_ROUTES.map(
  (route) => new RegExp(`^${route}.*`),
);
