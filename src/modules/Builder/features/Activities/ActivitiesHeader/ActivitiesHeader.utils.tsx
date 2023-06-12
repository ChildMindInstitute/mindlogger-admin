import i18n from 'i18n';
import { PerfTaskItemType } from 'shared/consts';

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
          performanceTaskType: PerfTaskItemType.ABTrailsIpad,
          isNavigationBlocked: true,
        }),
    },
    {
      title: PerformanceTasks.AbTrailsMobile,
      action: () =>
        getAction({
          performanceTaskName: PerformanceTasks.AbTrailsMobile,
          performanceTaskType: PerfTaskItemType.ABTrailsMobile,
          performanceTaskDesc: t('performanceTasksDesc.abTrails'),
          isNavigationBlocked: true,
        }),
    },
    {
      title: PerformanceTasks.Flanker,
      action: () =>
        getAction({
          performanceTaskName: PerformanceTasks.Flanker,
          performanceTaskType: PerfTaskItemType.Flanker,
          performanceTaskDesc: t('performanceTasksDesc.flanker'),
        }),
    },
    {
      title: PerformanceTasks.Gyroscope,
      action: () =>
        getAction({
          performanceTaskName: PerformanceTasks.Gyroscope,
          performanceTaskType: PerfTaskItemType.Gyroscope,
          performanceTaskDesc: t('performanceTasksDesc.gyroscope'),
        }),
    },
    {
      title: PerformanceTasks.Touch,
      action: () =>
        getAction({
          performanceTaskName: PerformanceTasks.Touch,
          performanceTaskType: PerfTaskItemType.Touch,
          performanceTaskDesc: t('performanceTasksDesc.touch'),
        }),
    },
  ];
};
