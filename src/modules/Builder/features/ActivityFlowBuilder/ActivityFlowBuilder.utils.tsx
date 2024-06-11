import { MouseEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Svg } from 'shared/components/Svg';
import { ItemType } from 'modules/Builder/components';
import { ActivityFlowFormValues, ActivityFormValues } from 'modules/Builder/types';
import { getEntityKey } from 'shared/utils/getEntityKey';

import {
  GetFlowBuilderActions,
  GetMenuItems,
  GetMenuItemsType,
  NonReviewableActivities,
} from './ActivityFlowBuilder.types';

const checkOnIdOrKey = (checkId: string) => (entity: ActivityFlowFormValues) =>
  (entity.id || entity.key) === checkId;

export const getActivityFlowIndex = (activityFlows: ActivityFlowFormValues[], checkId: string) =>
  activityFlows.findIndex(checkOnIdOrKey(checkId));

export const getMenuItems = ({
  type,
  index,
  onMenuClose,
  activities,
  onAddFlowActivity,
  onUpdateFlowActivity,
}: GetMenuItems) =>
  activities.map((activity, key) => ({
    title: activity.name,
    action: () => {
      const activityKey = activity.id || activity.key || '';
      type === GetMenuItemsType.AddActivity
        ? onAddFlowActivity && onAddFlowActivity(activityKey)
        : onUpdateFlowActivity &&
          index !== undefined &&
          onUpdateFlowActivity(index, { key: uuidv4(), activityKey });
      onMenuClose();
    },
    'data-testid': `builder-activity-flows-builder-add-activity-${key}`,
  }));

export const getFlowBuilderActions = ({
  index,
  replaceItem,
  duplicateItem,
  removeItem,
  replaceItemActionActive,
  'data-testid': dataTestid,
}: GetFlowBuilderActions) => [
  {
    icon: <Svg id="replace" />,
    action: (item?: ItemType, event?: MouseEvent<HTMLElement>) =>
      event && replaceItem(event, index),
    active: replaceItemActionActive,
    'data-testid': `${dataTestid}-replace`,
  },
  {
    icon: <Svg id="duplicate" />,
    action: () => duplicateItem(index),
    'data-testid': `${dataTestid}-duplicate`,
  },
  {
    icon: <Svg id="trash" />,
    action: removeItem,
    'data-testid': `${dataTestid}-remove`,
  },
];

export const getNonReviewableActivities = (activities: ActivityFormValues[]) =>
  activities.reduce(
    (acc: NonReviewableActivities, activity) => {
      if (!activity.isReviewable) {
        const key = getEntityKey(activity);
        acc.activities.push(activity);
        acc.activitiesIdsObjects[key] = activity;
      }

      return acc;
    },
    { activities: [], activitiesIdsObjects: {} },
  );
