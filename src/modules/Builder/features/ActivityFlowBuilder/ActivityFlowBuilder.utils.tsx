import { MouseEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Svg } from 'shared/components';
import { ItemType } from 'modules/Builder/components';
import { ActivityFlowFormValues } from 'modules/Builder/pages/BuilderApplet';

import { GetFlowBuilderActions, GetMenuItems, GetMenuItemsType } from './ActivityFlowBuilder.types';

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
  activities.map((activity) => ({
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
  }));

export const getFlowBuilderActions = ({
  index,
  replaceItem,
  duplicateItem,
  removeItem,
  replaceItemActionActive,
}: GetFlowBuilderActions) => [
  {
    icon: <Svg id="replace" />,
    action: (item?: ItemType, event?: MouseEvent<HTMLElement>) =>
      event && replaceItem(event, index),
    active: replaceItemActionActive,
  },
  {
    icon: <Svg id="duplicate" />,
    action: () => duplicateItem(index),
  },
  {
    icon: <Svg id="trash" />,
    action: removeItem,
  },
];
