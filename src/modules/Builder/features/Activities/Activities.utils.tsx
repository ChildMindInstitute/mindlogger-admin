import { Svg } from 'shared/components';
import { ActivityFormValues } from 'modules/Builder/pages/BuilderApplet';

import { GetActivitiesActions } from './Activities.types';

export const getActivityKey = (entity: ActivityFormValues): string => entity.key ?? entity.id ?? '';

export const getActions = ({
  isActivityHidden,
  onEdit,
  onDuplicate,
  onVisibilityChange,
  onRemove,
}: GetActivitiesActions) => [
  {
    icon: <Svg id="edit" />,
    action: onEdit,
  },
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
