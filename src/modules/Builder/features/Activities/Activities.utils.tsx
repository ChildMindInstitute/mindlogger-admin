import { Svg } from 'shared/components';
import { ActivityValue } from 'modules/Builder/types';

import { GetActivitiesActions } from './Activities.types';

export const getActivityKey = (entity: ActivityValue): string => entity.key ?? entity.id ?? '';

export const getActions = ({
  isActivityHidden,
  onEdit,
  onDuplicate,
  onVisibilityChange,
  onRemove,
  isEditVisible,
}: GetActivitiesActions) => [
  ...(isEditVisible
    ? [
        {
          icon: <Svg id="edit" />,
          action: onEdit,
        },
      ]
    : []),
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
