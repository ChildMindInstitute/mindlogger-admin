import { AssignedActivity, AssignedActivityFlow } from 'api';
import { AssignedHydratedActivityFlow } from 'modules/Dashboard/types';
import { Activity } from 'redux/modules';

/**
 * Hydrates activity flows with their associated activities
 * Optimized for performance with large datasets by using a Map for O(1) lookups
 */
export const hydrateActivityFlows = (
  flows: AssignedActivityFlow[],
  activities: AssignedActivity[],
): AssignedHydratedActivityFlow[] => {
  // Create a Map for O(1) lookups instead of using find() which is O(n)
  const activitiesMap = new Map<string, Activity>();

  // Only iterate through activities once
  for (const activity of activities) {
    if (activity.id) {
      activitiesMap.set(activity.id, activity as Activity);
    }
  }

  return flows.map((flow) => ({
    ...flow,
    activities: (flow.activityIds ?? [])
      .map((activityId) => activitiesMap.get(activityId))
      .filter(Boolean) as Activity[],
  }));
};
