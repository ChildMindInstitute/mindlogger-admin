export const updateItemIds = (
  shouldBeUpdated: boolean,
  itemIds: string[],
  activityItemId: string,
) =>
  shouldBeUpdated
    ? [...itemIds, activityItemId]
    : [...itemIds.filter((id) => id !== activityItemId)];
