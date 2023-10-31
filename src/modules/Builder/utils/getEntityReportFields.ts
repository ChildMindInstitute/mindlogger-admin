import { getEntityKey } from 'shared/utils';

export enum FlowReportFieldsPrepareType {
  KeyToName,
  NameToKey,
}

export type GetEntityReportFields<T> = {
  reportActivity: string;
  reportItem?: string;
  activities: T;
  type: FlowReportFieldsPrepareType;
};

export const getEntityReportFields = <
  T extends {
    name: string;
    id?: string;
    key?: string;
    items: { name: string; id?: string; key?: string }[];
  }[],
>({
  reportActivity,
  reportItem,
  activities,
  type,
}: GetEntityReportFields<T>) => {
  const isKeyToName = type === FlowReportFieldsPrepareType.KeyToName;
  let reportIncludedActivityName = reportActivity;

  const selectedReportActivity =
    reportIncludedActivityName &&
    activities.find(
      (activity) =>
        (isKeyToName ? getEntityKey(activity) : activity.name) === reportIncludedActivityName,
    );
  if (selectedReportActivity) {
    reportIncludedActivityName = isKeyToName
      ? selectedReportActivity.name
      : getEntityKey(selectedReportActivity);
  }

  if (!reportItem) return { reportIncludedActivityName };

  let reportIncludedItemName = reportItem;
  const selectedReportItem =
    selectedReportActivity &&
    reportIncludedItemName &&
    selectedReportActivity.items.find(
      (item) => (isKeyToName ? getEntityKey(item) : item.name) === reportIncludedItemName,
    );
  if (selectedReportItem) {
    reportIncludedItemName = isKeyToName
      ? selectedReportItem.name
      : getEntityKey(selectedReportItem);
  }

  return { reportIncludedActivityName, reportIncludedItemName };
};
