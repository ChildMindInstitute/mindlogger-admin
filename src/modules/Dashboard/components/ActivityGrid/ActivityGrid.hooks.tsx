import { useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { AssignedActivity } from 'api';
import { page } from 'resources';
import { ActionsMenu, MenuActionProps, Row } from 'shared/components';
import { DateFormats } from 'shared/consts';
import { StyledFlexTopCenter } from 'shared/styles';
import { workspaces } from 'redux/modules';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { getPerformanceTaskPath } from 'modules/Builder/features/Activities/Activities.utils';
import { EditablePerformanceTasksType } from 'modules/Builder/features/Activities/Activities.types';

import { useTakeNowModal } from '../TakeNowModal/TakeNowModal';

import {
  ActionsObject,
  ActivityActionProps,
  getActivityActions,
  StyledSvg,
  UseActivityGridProps,
} from '.';

export const useActivityGrid = ({
  dataTestId,
  activitiesData,
  onClickExportData,
  onClickAssign,
  onClickUnassign,
}: UseActivityGridProps) => {
  const navigate = useNavigate();
  const { appletId, subjectId } = useParams();
  const workspaceRoles = workspaces.useRolesData();
  const roles = appletId ? workspaceRoles?.data?.[appletId] : undefined;
  const { featureFlags } = useFeatureFlags();

  const { TakeNowModal, openTakeNowModal } = useTakeNowModal({ dataTestId });

  const getActivityById = useCallback(
    (id: string): AssignedActivity | null =>
      activitiesData?.activities.find((activity) => activity.id === id) ?? null,
    [activitiesData],
  );

  const defaultActions = useMemo(
    () => ({
      editActivity: ({ context }: MenuActionProps<ActivityActionProps>) => {
        const { activityId } = context || {};
        if (!activityId || !appletId) return;
        const activity = getActivityById(activityId);

        const navigateTo =
          activity?.isPerformanceTask && activity?.performanceTaskType
            ? // Additional validation for flanker, gyroscope, touch and unity is done in getActivityActions as these are the only editable options
              // Here it's safe to assume the task is EditablePerformanceTasksType
              getPerformanceTaskPath(
                activity?.performanceTaskType as unknown as EditablePerformanceTasksType,
              )
            : page.builderAppletActivity;

        return navigate(
          generatePath(navigateTo, {
            appletId,
            activityId,
          }),
        );
      },
      exportData: ({ context }: MenuActionProps<ActivityActionProps>) => {
        if (context?.activityId) {
          onClickExportData(context.activityId);
        }
      },
      assignActivity: ({ context }: MenuActionProps<ActivityActionProps>) => {
        if (context?.activityId) {
          onClickAssign(context.activityId);
        }
      },
      unassignActivity: ({ context }: MenuActionProps<ActivityActionProps>) => {
        if (context?.activityId) {
          onClickUnassign?.(context.activityId);
        }
      },
      takeNow: ({ context }: MenuActionProps<ActivityActionProps>) => {
        const { activityId } = context || { activityId: '' };
        const activity = getActivityById(activityId);
        if (activity) {
          openTakeNowModal(activity);
        }
      },
    }),
    [
      appletId,
      getActivityById,
      navigate,
      onClickAssign,
      onClickExportData,
      onClickUnassign,
      openTakeNowModal,
    ],
  );

  const formatRow = useCallback(
    (activity: AssignedActivity, actions?: ActionsObject): Row => {
      const activityId = String(activity.id);
      const name = activity.name;
      const image = String('image' in activity ? activity.image : '');

      // TODO: Populate with data from BE when available
      // (Jira ticket(s) still being drafted)
      const participantCount: number | null = null;
      const compliance: number | null = null;
      const trending: 'up' | 'down' | null = null;
      const latestActivity: string | null = null;

      return {
        id: {
          content: () => activityId,
          value: activityId,
        },
        image: {
          content: () => image,
          value: image,
        },
        name: {
          content: () => name,
          value: name,
        },
        participantCount: {
          content: () => participantCount,
          value: Number(participantCount),
        },
        latestActivity: {
          content: () =>
            !!latestActivity &&
            format(new Date(String(latestActivity)), DateFormats.MonthDayYearTime),
          value: String(latestActivity),
        },
        compliance: {
          content: () =>
            typeof compliance === 'number' && (
              <StyledFlexTopCenter as="span" sx={{ gap: 0.4 }}>
                {compliance}% {!!trending && <StyledSvg id={`trending-${trending}`} />}
              </StyledFlexTopCenter>
            ),
          value: Number(compliance),
        },
        actions: {
          content: () =>
            !!appletId && (
              <ActionsMenu
                menuItems={getActivityActions({
                  actions: actions ?? defaultActions,
                  appletId,
                  subjectId,
                  activity,
                  dataTestId,
                  roles,
                  featureFlags,

                  // TODO: Derive from participantCount
                  hasParticipants: true,
                })}
                data-testid={`${dataTestId}-activity-actions`}
                buttonColor="secondary"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              />
            ),
          value: '',
        },
      };
    },
    [appletId, subjectId, defaultActions, dataTestId, roles, featureFlags],
  );

  return { actions: defaultActions, getActivityById, formatRow, TakeNowModal, openTakeNowModal };
};
