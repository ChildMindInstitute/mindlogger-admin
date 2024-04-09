import { useState, useMemo, useEffect, useCallback } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

import { ActionsMenu, MenuActionProps, Row } from 'shared/components';
import { StyledFlexTopCenter } from 'shared/styles';
import { DatavizActivity, getSummaryActivitiesApi } from 'api';
import { useAsync } from 'shared/hooks';
import { DateFormats } from 'shared/consts';
import { page } from 'resources';
import { workspaces } from 'redux/modules';
import { ActivityGrid } from 'modules/Dashboard/components/ActivityGrid/ActivityGrid';
import { StyledSvg } from 'modules/Dashboard/components/ActivityGrid/ActivityGrid.styles';
import { ActivityActionProps } from 'modules/Dashboard/components/ActivityGrid/ActivityGrid.types';
import { getActivityActions } from 'modules/Dashboard/components/ActivityGrid/ActivityGrid.utils';

export const Activities = () => {
  const { appletId, participantId } = useParams();
  const navigate = useNavigate();
  const [activitiesData, setActivitiesData] = useState<{
    result: DatavizActivity[];
    count: number;
  } | null>();
  const [isLoading, setIsLoading] = useState(true);
  const dataTestid = 'dashboard-applet-participant-activities';

  const workspaceRoles = workspaces.useRolesData();
  const roles = appletId ? workspaceRoles?.data?.[appletId] : undefined;
  /**
   * TODO M2-6223:
   * getAppletActivitiesApi returns activities for the currently logged in user (an admin/collaborator). This behavior is correct for M2-5585, as per the note:
   *  "for this ticket all activities in the applet are assigned to the user as we have not yet introduced the concept of assigning activities to users."
   * This endpoint could be updated to include a `participant_id` param and retrieve _other_ user's assigned activities
   *
   * Alternatively, we can use `getSummaryActivitiesApi` as that endpoint _does_ retrieve the target users activities
   * However this endpoint returns a reduced response (id, name, isPerformanceTask, hasAnswer) that doesn't include all Activity metadata
   * so it needs to be updated to include everything (id, name, image )
   */
  const { execute: getSummaryActivities } = useAsync(
    getSummaryActivitiesApi,
    (response) => {
      const activities = response?.data.result;

      return setActivitiesData({ result: activities, count: activities.length });
    },
    undefined,
    () => setIsLoading(false),
  );

  useEffect(() => {
    if (!appletId || !participantId) return;

    getSummaryActivities({
      appletId,
      targetSubjectId: participantId,
    });
  }, [appletId, participantId, getSummaryActivities]);

  const actions = useMemo(
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
        // TODO: Implement Take Now
        // https://mindlogger.atlassian.net/browse/M2-5711
        const { activityId } = context || {};
        alert(`TODO: Take now (${activityId})`);
      },
    }),
    [appletId, navigate],
  );

  const formatRow = useCallback(
    (activity: DatavizActivity): Row => {
      const activityId = String(activity.id);
      const name = activity.name;
      // TODO: getSummaryActivitiesApi needs to be updated to return `image`
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
                menuItems={getActivityActions({ actions, appletId, activityId, dataTestid, roles })}
                data-testid={`${dataTestid}-activity-actions`}
                buttonColor="secondary"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              />
            ),
          value: '',
        },
      };
    },
    [actions, appletId, roles],
  );

  const activities = useMemo(
    () => (activitiesData?.result ?? []).map((activity) => formatRow(activity)),
    [activitiesData, formatRow],
  );

  return (
    <ActivityGrid
      rows={activities}
      order={'desc'}
      orderBy={''}
      isLoading={isLoading}
      data-testid={dataTestid}
    />
  );
};

export default Activities;
