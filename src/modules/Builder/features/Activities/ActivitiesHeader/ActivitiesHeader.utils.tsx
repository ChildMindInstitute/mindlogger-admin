import i18n from 'i18n';
import { PerfTaskType } from 'shared/consts';

import { ActivityAddProps, PerformanceTasks } from '../Activities.types';

const { t } = i18n;

export const getPerformanceTasksMenu = (
  onAddActivity: (props: ActivityAddProps) => void,
  setAnchorEl: (el: null | HTMLElement) => void,
) => {
  const getAction = (props: ActivityAddProps) => {
    onAddActivity(props);
    setAnchorEl(null);
  };

  return [
    {
      title: PerformanceTasks.AbTrailsIpad,
      action: () =>
        getAction({
          performanceTaskName: PerformanceTasks.AbTrailsIpad,
          performanceTaskDesc: t('performanceTasksDesc.abTrails'),
          performanceTaskType: PerfTaskType.ABTrailsTablet,
          isNavigationBlocked: true,
        }),
      'data-testid': 'builder-activities-add-perf-task-abtrails',
    },
    {
      title: PerformanceTasks.AbTrailsMobile,
      action: () =>
        getAction({
          performanceTaskName: PerformanceTasks.AbTrailsMobile,
          performanceTaskType: PerfTaskType.ABTrailsMobile,
          performanceTaskDesc: t('performanceTasksDesc.abTrails'),
          isNavigationBlocked: true,
        }),
      'data-testid': 'builder-activities-add-perf-task-abtrails-mobile',
    },
    {
      title: PerformanceTasks.Flanker,
      action: () =>
        getAction({
          performanceTaskName: PerformanceTasks.Flanker,
          performanceTaskType: PerfTaskType.Flanker,
          performanceTaskDesc: t('performanceTasksDesc.flanker'),
        }),
      'data-testid': 'builder-activities-add-perf-task-flanker',
    },
    {
      title: PerformanceTasks.Gyroscope,
      action: () =>
        getAction({
          performanceTaskName: PerformanceTasks.Gyroscope,
          performanceTaskType: PerfTaskType.Gyroscope,
          performanceTaskDesc: t('performanceTasksDesc.gyroscope'),
        }),
      'data-testid': 'builder-activities-add-perf-task-gyroscope',
    },
    {
      title: PerformanceTasks.Touch,
      action: () =>
        getAction({
          performanceTaskName: PerformanceTasks.Touch,
          performanceTaskType: PerfTaskType.Touch,
          performanceTaskDesc: t('performanceTasksDesc.touch'),
        }),
      'data-testid': 'builder-activities-add-perf-task-touch',
    },
  ];
};
