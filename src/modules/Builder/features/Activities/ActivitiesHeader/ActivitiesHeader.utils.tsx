import i18n from 'i18n';
import { PerfTaskType } from 'shared/consts';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { ActivityAddProps, PerformanceTasks } from '../Activities.types';

const { t } = i18n;

const getMenuItemTitle = (perfTask: string) => `performanceTasks.${perfTask}`;

export const GetPerformanceTasksMenu = (
  onAddActivity: (props: ActivityAddProps) => void,
  setAnchorEl: (el: null | HTMLElement) => void,
) => {
  const {
    featureFlags: { enableMeritActivityType },
  } = useFeatureFlags();

  const getAction = (props: ActivityAddProps) => {
    onAddActivity(props);
    setAnchorEl(null);
  };

  return [
    ...(enableMeritActivityType
      ? [
          {
            title: getMenuItemTitle(PerformanceTasks.Unity),
            action: () =>
              getAction({
                performanceTaskName: t(getMenuItemTitle(PerformanceTasks.Unity)),
                performanceTaskDesc: t('performanceTasksDesc.unity'),
                performanceTaskType: PerfTaskType.Unity,
                isNavigationBlocked: true,
              }),
            'data-testid': 'builder-activities-add-perf-task-unity',
          },
        ]
      : []),
    {
      title: getMenuItemTitle(PerformanceTasks.AbTrailsIpad),
      action: () =>
        getAction({
          performanceTaskName: t(getMenuItemTitle(PerformanceTasks.AbTrailsIpad)),
          performanceTaskDesc: t('performanceTasksDesc.abTrails'),
          performanceTaskType: PerfTaskType.ABTrailsTablet,
          isNavigationBlocked: true,
        }),
      'data-testid': 'builder-activities-add-perf-task-abtrails',
    },
    {
      title: getMenuItemTitle(PerformanceTasks.AbTrailsMobile),
      action: () =>
        getAction({
          performanceTaskName: t(getMenuItemTitle(PerformanceTasks.AbTrailsMobile)),
          performanceTaskType: PerfTaskType.ABTrailsMobile,
          performanceTaskDesc: t('performanceTasksDesc.abTrails'),
          isNavigationBlocked: true,
        }),
      'data-testid': 'builder-activities-add-perf-task-abtrails-mobile',
    },
    {
      title: getMenuItemTitle(PerformanceTasks.Flanker),
      action: () =>
        getAction({
          performanceTaskName: t(getMenuItemTitle(PerformanceTasks.Flanker)),
          performanceTaskType: PerfTaskType.Flanker,
          performanceTaskDesc: t('performanceTasksDesc.flanker'),
        }),
      'data-testid': 'builder-activities-add-perf-task-flanker',
    },
    {
      title: getMenuItemTitle(PerformanceTasks.Gyroscope),
      action: () =>
        getAction({
          performanceTaskName: t(getMenuItemTitle(PerformanceTasks.Gyroscope)),
          performanceTaskType: PerfTaskType.Gyroscope,
          performanceTaskDesc: t('performanceTasksDesc.gyroscope'),
        }),
      'data-testid': 'builder-activities-add-perf-task-gyroscope',
    },
    {
      title: getMenuItemTitle(PerformanceTasks.Touch),
      action: () =>
        getAction({
          performanceTaskName: t(getMenuItemTitle(PerformanceTasks.Touch)),
          performanceTaskType: PerfTaskType.Touch,
          performanceTaskDesc: t('performanceTasksDesc.touch'),
        }),
      'data-testid': 'builder-activities-add-perf-task-touch',
    },
  ];
};
