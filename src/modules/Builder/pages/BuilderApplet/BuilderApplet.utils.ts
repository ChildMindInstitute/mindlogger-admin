import uniqueId from 'lodash.uniqueid';
import { matchPath } from 'react-router-dom';

import i18n from 'i18n';
import { page } from 'resources';
import { SingleApplet } from 'shared/state';
import { getDictionaryText } from 'shared/utils';

const { t } = i18n;

export const isAppletRoute = (path: string) => matchPath(`${page.builderApplet}/*`, path);

export const getNewActivity = () => ({
  key: uniqueId(),
  name: '',
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
  activityFlows: [],
});

export const getNewActivityItem = () => ({
  id: uniqueId(),
  responseType: '',
  name: t('newItemName'),
  question: '',
  settings: [],
  isHidden: false,
});

export const getNewActivityFlow = () => ({
  id: uniqueId(),
});

export const getDefaultValues = (appletData?: SingleApplet) => {
  if (!appletData) return getNewApplet();

  return {
    ...appletData,
    description: getDictionaryText(appletData.description),
    about: getDictionaryText(appletData.about),
    activities: appletData.activities
      ? appletData.activities.map((activity) => ({
          ...activity,
          items: activity.items
            ? activity.items.map((item) => ({
                ...item,
                id: `${item.id}`,
                question: getDictionaryText(item.question),
              }))
            : [],
        }))
      : [],
  };
};
