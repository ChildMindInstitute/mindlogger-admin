import { t } from 'i18next';

import { Svg } from 'shared/components/Svg';
import { MenuItem } from 'shared/components';

import { ActivityActions, ActivityActionProps } from './Activities.types';

export const getActivityActions = ({
  actions: { editActivity, exportData, assignActivity, takeNow },
  appletId,
  activityId,
}: ActivityActions): MenuItem<ActivityActionProps>[] => [
  {
    icon: <Svg id="edit" />,
    action: editActivity,
    title: t('editActivity'),
    context: { appletId, activityId },
    isDisplayed: true,
    'data-testid': 'dashboard-applets-activities-activity-edit',
  },
  {
    icon: <Svg id="export" />,
    action: exportData,
    title: t('exportData'),
    context: { appletId, activityId },
    isDisplayed: true,
    'data-testid': 'dashboard-applets-activities-activity-export',
  },
  { type: 'divider' },
  {
    icon: <Svg id="add" />,
    action: assignActivity,
    title: t('assignActivity'),
    context: { appletId, activityId },
    isDisplayed: true,
    'data-testid': 'dashboard-applets-activities-activity-assign',
  },
  {
    icon: <Svg id="play-outline" />,
    action: takeNow,
    title: t('takeNow'),
    context: { appletId, activityId },
    isDisplayed: true,
    'data-testid': 'dashboard-applets-activities-activity-take-now',
  },
];
