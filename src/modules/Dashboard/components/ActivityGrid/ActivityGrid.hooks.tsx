import { useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { DatavizActivity } from 'api';
import { page } from 'resources';
import { ActionsMenu, MenuActionProps, Row } from 'shared/components';
import { DateFormats } from 'shared/consts';
import { StyledFlexTopCenter } from 'shared/styles';
import { Activity, workspaces } from 'redux/modules';
import {
  ActionsObject,
  ActivitiesData,
  ActivityActionProps,
  BaseActivity,
  getActivityActions,
  StyledSvg,
} from 'modules/Dashboard/components/ActivityGrid';
import { useLaunchDarkly } from 'shared/hooks/useLaunchDarkly';

import { useTakeNowModal } from '../TakeNowModal/TakeNowModal';

export const useActivityGrid = (dataTestId: string, activitiesData: ActivitiesData | null) => {
  const navigate = useNavigate();
  const { appletId } = useParams();
  const workspaceRoles = workspaces.useRolesData();
  const roles = appletId ? workspaceRoles?.data?.[appletId] : undefined;
  const { flags: featureFlags } = useLaunchDarkly();

  const { TakeNowModal, openTakeNowModal } = useTakeNowModal({ dataTestId });

  const getActivityById = useCallback(
    (id: string): BaseActivity | null => {
      if (!activitiesData) return null;

      return (
        (activitiesData.result as BaseActivity[]).find((activity) => activity.id === id) || null
      );
    },
    [activitiesData],
  );

  const defaultActions = useMemo(
    () => ({
      editActivity: ({ context }: MenuActionProps<ActivityActionProps>) => {
        const { activityId } = context || {};

        navigate(
          generatePath(page.builderAppletActivity, {
            appletId,
            activityId,
          }),
        );
      },
      exportData: ({ context }: MenuActionProps<ActivityActionProps>) => {
        const { activityId } = context || {};
        // TODO: Implement export data
        // https://mindlogger.atlassian.net/browse/M2-6039
        alert(`TODO: Export data (${activityId})`);
      },
      assignActivity: ({ context }: MenuActionProps<ActivityActionProps>) => {
        const { activityId } = context || {};
        // TODO: Implement assign
        // https://mindlogger.atlassian.net/browse/M2-5710
        alert(`TODO: Assign activity (${activityId})`);
      },
      takeNow: ({ context }: MenuActionProps<ActivityActionProps>) => {
        const { activityId } = context || { activityId: '' };
        const activity = getActivityById(activityId);
        if (activity) {
          openTakeNowModal(activity);
        }
      },
    }),
    [appletId, getActivityById, navigate, openTakeNowModal],
  );

  const formatRow = useCallback(
    (activity: Activity | DatavizActivity, actions?: ActionsObject): Row => {
      const activityId = String(activity.id);
      const name = activity.name;
      // TODO M2-6223: getSummaryActivitiesApi needs to be updated to return `image`
      const image = String('image' in activity ? activity.image : '');

      // TODO: Populate with data from BE when available
      // (Jira ticket(s) still being drafted)
      const participantCount: number | null = null;
      const compliance: number | null = null;
      const trending: 'up' | 'down' | null = null;
      const latestActivity: string | null = null;

      return {
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
                  actions: actions || defaultActions,
                  appletId,
                  activityId,
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
    [appletId, roles, defaultActions, dataTestId, featureFlags],
  );

  return { actions: defaultActions, getActivityById, formatRow, TakeNowModal, openTakeNowModal };
};