import { Svg } from 'shared/components/Svg';
import { ActivityFormValues } from 'modules/Builder/types';
import { page } from 'resources';
import { PerfTaskType } from 'shared/consts';

import { EditablePerformanceTasksType, GetActivitiesActions } from './Activities.types';

export const getActivityKey = (entity: ActivityFormValues): string => entity.key ?? entity.id ?? '';

export const getActions = ({
  isActivityHidden,
  onEdit,
  onDuplicate,
  onVisibilityChange,
  onRemove,
  isEditVisible,
  'data-testid': dataTestid,
}: GetActivitiesActions) => [
  ...(isEditVisible
    ? [
        {
          icon: <Svg id="edit" />,
          action: onEdit,
          'data-testid': `${dataTestid}-edit`,
        },
      ]
    : []),
  {
    icon: <Svg id="duplicate" />,
    action: onDuplicate,
    'data-testid': `${dataTestid}-duplicate`,
  },
  {
    icon: <Svg id={isActivityHidden ? 'visibility-off' : 'visibility-on'} />,
    action: onVisibilityChange,
    isStatic: isActivityHidden,
    'data-testid': `${dataTestid}-hide`,
  },
  {
    icon: <Svg id="trash" />,
    action: onRemove,
    'data-testid': `${dataTestid}-remove`,
  },
];

const performanceTaskPaths: Record<EditablePerformanceTasksType, string> = {
  [PerfTaskType.Flanker]: page.builderAppletFlanker,
  [PerfTaskType.Gyroscope]: page.builderAppletGyroscope,
  [PerfTaskType.Touch]: page.builderAppletTouch,
};

export const getPerformanceTaskPath = (performanceTask: EditablePerformanceTasksType) =>
  performanceTaskPaths[performanceTask];
