import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { DatavizActivity, getSummaryActivitiesApi } from 'api';
import { useAsync } from 'shared/hooks';
import { ActivityGrid, useActivityGrid } from 'modules/Dashboard/components/ActivityGrid';

export const Activities = () => {
  const { appletId, participantId } = useParams();
  const [activitiesData, setActivitiesData] = useState<{
    result: DatavizActivity[];
    count: number;
  } | null>();
  const [isLoading, setIsLoading] = useState(true);
  const dataTestId = 'dashboard-applet-participant-activities';

  const { formatRow } = useActivityGrid(dataTestId);
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
      data-testid={dataTestId}
    />
  );
};

export default Activities;
