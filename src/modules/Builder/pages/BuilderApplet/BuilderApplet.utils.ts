import uniqueId from 'lodash.uniqueid';

import i18n from 'i18n';
import { ACTIVITIES_PAGE_REGEXP_STRING } from 'shared/utils';

import { ACTIVITY_LAYER_ROUTES, APPLET_LAYER_ROUTES } from './BuilderApplet.const';

const { t } = i18n;

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

export const getNewActivity = () => ({
  key: uniqueId(),
  name: t('newActivityName'),
  description: '',
  items: [],
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  responseIsEditable: false,
});

export const getNewApplet = () => ({
  displayName: '',
  description: '',
  themeId: 'default',
  about: '',
  image: '',
  watermark: '',
  activities: [],
});

export const getNewActivityItem = () => ({
  id: uniqueId(),
  responseType: '',
  name: t('newItemName'),
  question: '',
  settings: [],
  isHidden: false,
});
