import { matchPath } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import i18n from 'i18n';
import { Svg } from 'shared/components';
import { page } from 'resources';
import { SingleApplet } from 'shared/state';
import { getDictionaryText } from 'shared/utils';
import { Item } from 'shared/state/Applet';

import { ActivityFormValues } from './BuilderApplet.types';

const { t } = i18n;

export const isAppletRoute = (path: string) => matchPath(`${page.builderApplet}/*`, path);

export const getNewActivity = (activity?: ActivityFormValues) => ({
  name: t('newActivity'),
  description: '',
  items: [],
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  responseIsEditable: false,
  ...activity,
  key: uuidv4(),
});

export const getNewApplet = () => ({
  displayName: '',
  description: '',
  themeId: 'default',
  about: '',
  image: '',
  watermark: '',
  activities: [],
  activityFlows: [],
});

export const getNewActivityItem = () => ({
  id: uuidv4(),
  responseType: '',
  name: '',
  question: '',
  settings: [],
  isHidden: false,
});

export const getNewActivityFlow = () => ({
  id: uuidv4(),
  name: '',
  description: '',
  isSingleReport: false,
  hideBadge: false,
});

const getActivityItems = (items: Item[]) =>
  items
    ? items.map((item) => ({
        ...item,
        id: `${item.id}`,
        question: getDictionaryText(item.question),
        responseType: item.responseType,
      }))
    : [];

export const getDefaultValues = (appletData?: SingleApplet) => {
  if (!appletData) return getNewApplet();

  return {
    ...appletData,
    description: getDictionaryText(appletData.description),
    about: getDictionaryText(appletData.about),
    activities: appletData.activities
      ? appletData.activities.map((activity) => ({
          ...activity,
          description: getDictionaryText(activity.description),
          items: getActivityItems(activity.items),
        }))
      : [],
    activityFlows: appletData.activityFlows.map((activityFlow) => ({
      ...activityFlow,
      description: getDictionaryText(activityFlow.description),
    })),
  };
};

export const getAppletTabs = ({
  hasAboutAppletErrors,
  hasAppletActivitiesErrors,
  hasAppletActivityFlowErrors,
}: Record<string, boolean>) => [
  {
    labelKey: 'aboutApplet',
    icon: <Svg id="more-info-outlined" />,
    activeIcon: <Svg id="more-info-filled" />,
    path: Path.About,
    hasError: hasAboutAppletErrors,
  },
  {
    labelKey: 'activities',
    icon: <Svg id="checklist-outlined" />,
    activeIcon: <Svg id="checklist-filled" />,
    path: Path.Activities,
    hasError: hasAppletActivitiesErrors,
  },
  {
    labelKey: 'activityFlow',
    icon: <Svg id="flow-outlined" />,
    activeIcon: <Svg id="flow-filled" />,
    path: Path.ActivityFlow,
    hasError: hasAppletActivityFlowErrors,
  },
  {
    labelKey: 'appletSettings',
    icon: <Svg id="settings" />,
    activeIcon: <Svg id="settings-filled" />,
    path: Path.Settings,
  },
];
