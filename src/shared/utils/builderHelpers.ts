export const getEntityKey = <T extends { id?: string; key?: string }>(entity: T) =>
  entity?.id ?? entity?.key ?? '';

export const getObjectFromList = <T extends { id?: string; key?: string }>(
  items: T[] = [],
  getUniqueKey?: (data: T) => string,
): Record<string, T> =>
  items.reduce(
    (acc, item) => ({
      ...acc,
      [(getUniqueKey ?? getEntityKey)(item)]: item,
    }),
    {},
  );
