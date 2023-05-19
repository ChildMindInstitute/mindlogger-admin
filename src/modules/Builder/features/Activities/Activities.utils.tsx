import { Svg } from 'shared/components';
import { ActivityFormValues, PerformanceTaskFormValues } from 'modules/Builder/pages/BuilderApplet';

import { GetActivitiesActions } from './Activities.types';

export const getActivityKey = (entity: ActivityFormValues | PerformanceTaskFormValues): string =>
  entity.key ?? entity.id ?? '';

export const getActions = ({
  isActivityHidden,
  onEdit,
  onDuplicate,
  onVisibilityChange,
  onRemove,
  isEditVisible,
}: GetActivitiesActions) => {
  const actions = [];
  if (isEditVisible) {
    actions.push({
      icon: <Svg id="edit" />,
      action: onEdit,
    });
  }

  return [
    ...actions,
    {
      icon: <Svg id="duplicate" />,
      action: onDuplicate,
    },
    {
      icon: <Svg id={isActivityHidden ? 'visibility-off' : 'visibility-on'} />,
      action: onVisibilityChange,
      isStatic: isActivityHidden,
    },
    {
      icon: <Svg id="trash" />,
      action: onRemove,
    },
  ];
};
