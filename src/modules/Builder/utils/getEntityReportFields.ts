import { getEntityKey } from 'shared/utils';

export enum FlowReportFieldsPrepareType {
  KeyToName,
  NameToKey,
}

export type GetEntityReportFields<T, K> = {
  reportActivity?: string;
  reportItem?: string;
  activities?: T;
  activityItems?: K;
  type: FlowReportFieldsPrepareType;
};

export const getEntityReportFields = <
  T extends {
    name: string;
    id?: string;
    key?: string;
    items: { name: string; id?: string; key?: string }[];
  }[],
  K extends { name: string; id?: string; key?: string }[],
>({
  reportActivity,
  reportItem,
  activities,
  activityItems,
  type,
}: GetEntityReportFields<T, K>) => {
  const isKeyToName = type === FlowReportFieldsPrepareType.KeyToName;
  let reportIncludedActivityName = '';

  const selectedReportActivity =
    !activityItems &&
    reportActivity &&
    activities?.find((activity) => (isKeyToName ? getEntityKey(activity) : activity.name) === reportActivity);
  if (selectedReportActivity) {
    reportIncludedActivityName = isKeyToName ? selectedReportActivity.name : getEntityKey(selectedReportActivity);
  }

  let selectedReportItem;
  if (activityItems) {
    selectedReportItem =
      reportItem && activityItems.find((item) => (isKeyToName ? getEntityKey(item) : item.name) === reportItem);
  } else {
    selectedReportItem =
      selectedReportActivity &&
      reportItem &&
      selectedReportActivity.items?.find((item) => (isKeyToName ? getEntityKey(item) : item.name) === reportItem);
  }
  let reportIncludedItemName = '';
  if (selectedReportItem) {
    reportIncludedItemName = isKeyToName ? selectedReportItem.name : getEntityKey(selectedReportItem);
  }

  return activityItems ? { reportIncludedItemName } : { reportIncludedActivityName, reportIncludedItemName };
};
