import { useMemo } from 'react';

import { useGetAppletActivitiesQuery } from 'modules/Dashboard/api/apiSlice';

import { useFeatureFlags } from './useFeatureFlags';

/**
 * Custom hook to determine if EHR health data may be available in the applet based on feature flag
 * and the presence of EHR item types in the given applet.
 *
 * @param appletId Applet ID to fetch activities from
 * @param activityId Optional activity ID to narrow the search to a specific activity
 * @param flowId Optional flow ID to narrow the search to activities in a specific flow
 * @returns Boolean indicating whether EHR health data may be available in the applet
 */
export const useHasEhrHealthData = ({
  appletId,
  activityId,
  flowId,
}: {
  appletId?: string;
  activityId?: string;
  flowId?: string;
}) => {
  const { featureFlags } = useFeatureFlags();

  const { data } = useGetAppletActivitiesQuery(
    { params: { appletId: appletId ?? '' } },
    { skip: !appletId },
  );

  return useMemo(() => {
    if (featureFlags.enableEhrHealthData === 'unavailable') return false;

    if (!data?.activitiesDetails) return false;

    const activities = data?.activitiesDetails ?? [];
    const flows = data?.appletDetail.activityFlows ?? [];

    let activitiesToCheck = activities;

    // If we have a flowId, filter activities to only those in the flow
    if (flowId) {
      const activityFlow = flows.find(({ id }) => id === flowId);
      const activityIds = activityFlow?.activityIds || [];
      if (!activityIds.length) return false;

      // Filter to only activities in this flow
      activitiesToCheck = activities.filter((activity) => activityIds.includes(activity.id || ''));
    }
    // If we have an activityId, filter to just that one activity
    else if (activityId) {
      const activity = activities.find(({ id }) => id === activityId);
      if (!activity) return false;

      activitiesToCheck = [activity];
    }

    // Check if any of the selected activities contain an EHR item type
    return activitiesToCheck.some((activity) =>
      activity.items.some(({ responseType }) => responseType === 'requestHealthRecordData'),
    );
  }, [featureFlags.enableEhrHealthData, data, activityId, flowId]);
};
