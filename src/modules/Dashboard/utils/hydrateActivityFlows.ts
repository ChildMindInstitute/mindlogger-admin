import { AssignedActivity, AssignedActivityFlow } from 'api';
import { AssignedHydratedActivityFlow } from 'modules/Dashboard/types';
import { Activity } from 'redux/modules';

export const hydrateActivityFlows = (
  flows: AssignedActivityFlow[],
  activities: AssignedActivity[],
): AssignedHydratedActivityFlow[] =>
  flows.map((flow) => ({
    ...flow,
    activities: (flow.activityIds ?? [])
      .map((activityId) => activities.find(({ id }) => id === activityId))
      .filter(Boolean) as Activity[],
  }));
