import { Svg } from 'shared/components';
import { ActivityFormValues } from 'modules/Builder/types';
import { page } from 'resources';

import {
  EditablePerformanceTasksType,
  GetActivitiesActions,
  PerformanceTasks,
} from './Activities.types';

export const getActivityKey = (entity: ActivityFormValues): string => entity.key ?? entity.id ?? '';

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

const performanceTaskPaths: Record<EditablePerformanceTasksType, string> = {
  [PerformanceTasks.Flanker]: page.builderAppletFlanker,
  [PerformanceTasks.Gyroscope]: page.builderAppletGyroscope,
  [PerformanceTasks.Touch]: page.builderAppletTouch,
};

export const getPerformanceTaskPath = (performanceTask: EditablePerformanceTasksType) =>
  performanceTaskPaths[performanceTask];
