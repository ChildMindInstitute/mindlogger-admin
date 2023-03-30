import { Svg } from 'shared/components';
import { page } from 'resources';
import {
  ACTIVITY_PAGE_REGEXP_STRING,
  getAppletActivityPageRegexp,
  getAppletPageRegexp,
  Path,
} from 'shared/utils';

export const pathsWithInnerTabs = [page.newAppletNewActivity, page.newAppletNewActivityFlow]; // TODO add acitivityId + activityFlowId if exist

export const newAppletTabs = [
  {
    labelKey: 'aboutApplet',
    icon: <Svg id="more-info-outlined" />,
    activeIcon: <Svg id="more-info-filled" />,
    path: Path.About,
  },
  {
    labelKey: 'activities',
    icon: <Svg id="checklist-outlined" />,
    activeIcon: <Svg id="checklist-filled" />,
    path: Path.Activities,
  },
  {
    labelKey: 'activityFlow',
    icon: <Svg id="flow-outlined" />,
    activeIcon: <Svg id="flow-filled" />,
    path: Path.ActivityFlow,
  },
  {
    labelKey: 'appletSettings',
    icon: <Svg id="settings" />,
    activeIcon: <Svg id="settings-filled" />,
    path: Path.Settings,
  },
];

export const APPLET_LAYER_ROUTES = [
  getAppletPageRegexp(Path.About),
  getAppletPageRegexp(Path.Activities),
  getAppletPageRegexp(Path.ActivityFlow),
  getAppletPageRegexp(Path.Settings),
];
export const ACTIVITY_LAYER_ROUTES = [
  ACTIVITY_PAGE_REGEXP_STRING,
  getAppletActivityPageRegexp(Path.About),
  getAppletActivityPageRegexp(Path.Items),
  getAppletActivityPageRegexp(Path.ItemsFlow),
  getAppletActivityPageRegexp(Path.Settings),
];
