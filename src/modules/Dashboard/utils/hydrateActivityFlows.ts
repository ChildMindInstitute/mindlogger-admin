import { HydratedActivityFlow } from 'modules/Dashboard/types';
import { Activity, ActivityFlow } from 'redux/modules';

export const hydrateActivityFlows = (
  flows: ActivityFlow[],
  activities: Activity[],
): HydratedActivityFlow[] =>
  flows.map((flow) => ({
    ...flow,
    activities: (flow.activityIds ?? [])
      .map((activityId) => activities.find(({ id }) => id === activityId))
      .filter(Boolean) as Activity[],
  }));
