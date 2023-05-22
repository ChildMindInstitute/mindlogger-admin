import i18n from 'i18n';

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
          isNavigationBlocked: true,
        }),
    },
    {
      title: PerformanceTasks.AbTrailsMobile,
      action: () =>
        getAction({
          performanceTaskName: PerformanceTasks.AbTrailsMobile,
          performanceTaskDesc: t('performanceTasksDesc.abTrails'),
          isNavigationBlocked: true,
        }),
    },
    {
      title: PerformanceTasks.Flanker,
      action: () =>
        getAction({
          performanceTaskName: PerformanceTasks.Flanker,
          performanceTaskDesc: t('performanceTasksDesc.flanker'),
          isNavigationBlocked: true,
        }),
    },
    {
      title: PerformanceTasks.Gyroscope,
      action: () =>
        getAction({
          performanceTaskName: PerformanceTasks.Gyroscope,
          performanceTaskDesc: t('performanceTasksDesc.gyroscope'),
          isNavigationBlocked: true,
        }),
    },
    {
      title: PerformanceTasks.Touch,
      action: () =>
        getAction({
          performanceTaskName: PerformanceTasks.Touch,
          performanceTaskDesc: t('performanceTasksDesc.touch'),
          isNavigationBlocked: true,
        }),
    },
  ];
};
