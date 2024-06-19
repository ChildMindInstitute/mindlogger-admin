import { ActivityFlowFormValues } from 'modules/Builder/types';

export const getUpdatedActivityFlows = (
  activityFlows: ActivityFlowFormValues[],
  keyToRemove: string,
) =>
  activityFlows.reduce((acc: ActivityFlowFormValues[], flow) => {
    if (flow.reportIncludedActivityName === keyToRemove) {
      flow.reportIncludedActivityName = '';
      flow.reportIncludedItemName = '';
    }
    const items = flow.items?.filter((item) => item.activityKey !== keyToRemove);
    if (items && items.length > 0) {
      acc.push({ ...flow, items });
    }

    return acc;
  }, []);
