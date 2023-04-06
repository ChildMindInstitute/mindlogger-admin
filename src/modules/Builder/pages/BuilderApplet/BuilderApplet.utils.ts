import { matchPath } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { page } from 'resources';
import { SingleApplet } from 'shared/state';
import { getDictionaryText } from 'shared/utils';

import { ActivityFormValues } from './BuilderApplet.types';

export const isAppletRoute = (path: string) => matchPath(`${page.builderApplet}/*`, path);

export const getNewActivity = (activity?: ActivityFormValues) => ({
  name: '',
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
          description: getDictionaryText(activity.description),
          items: activity.items
            ? activity.items.map((item) => ({
                ...item,
                id: `${item.id}`,
                question: getDictionaryText(item.question),
                responseType: item.responseType,
              }))
            : [],
        }))
      : [],
    activityFlows: appletData?.activityFlows.map((activityFlow) => ({
      ...activityFlow,
      description: getDictionaryText(activityFlow.description),
    })),
  };
};
