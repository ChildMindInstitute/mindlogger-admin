import { useState, useMemo, useEffect, useCallback } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

import { ActionsMenu, MenuActionProps, Row } from 'shared/components';
import { StyledFlexTopCenter } from 'shared/styles';
import { getAppletActivitiesApi } from 'api';
import { useAsync } from 'shared/hooks';
import { DateFormats } from 'shared/consts';
import { page } from 'resources';
import { Activity, workspaces } from 'redux/modules';
import { ActivityGrid } from 'modules/Dashboard/components/ActivityGrid/ActivityGrid';
import { StyledSvg } from 'modules/Dashboard/components/ActivityGrid/ActivityGrid.styles';
import { getActivityActions } from 'modules/Dashboard/components/ActivityGrid/ActivityGrid.utils';
import {
  ActivitiesData,
  ActivityActionProps,
} from 'modules/Dashboard/components/ActivityGrid/ActivityGrid.types';

export const Activities = () => {
  const { appletId } = useParams();
  const navigate = useNavigate();
  const [activitiesData, setActivitiesData] = useState<ActivitiesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dataTestid = 'dashboard-applet-activities';

  const workspaceRoles = workspaces.useRolesData();
  const roles = appletId ? workspaceRoles?.data?.[appletId] : undefined;

  const { execute: getActivities } = useAsync(
    getAppletActivitiesApi,
    (response) => {
      const activitiesDetails = response?.data.result.activitiesDetails;

      return setActivitiesData({ result: activitiesDetails, count: activitiesDetails.length });
    },
    undefined,
    () => setIsLoading(false),
  );

  useEffect(() => {
    if (!appletId) return;

    getActivities({
      params: {
        appletId,
      },
    });

    return () => {
      setActivitiesData(null);
    };
  }, [appletId, getActivities]);

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
    [],
  );

  const formatRow = useCallback(
    (activity: Activity): Row => {
      const activityId = String(activity.id);
      const name = activity.name;
      const image = String(activity.image);

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
    [actions, appletId],
  );

  const activities = useMemo(
    () => (activitiesData?.result ?? []).map((activity) => formatRow(activity as Activity)),
    [activitiesData, formatRow],
  );

  useEffect(() => {
    if (!appletId) return;

    return () => {
      setActivitiesData(null);
    };
  }, [appletId]);

  return (
    <ActivityGrid
      rows={activities}
      data-testid={dataTestid}
      isLoading={isLoading}
      order={'desc'}
      orderBy={''}
    />
  );
};
