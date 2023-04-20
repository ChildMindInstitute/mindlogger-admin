export const getEntityKey = <T extends { id?: string; key?: string }>(entity: T) =>
  entity?.id ?? entity?.key ?? '';

export const getObjectFromList = <T extends { id?: string; key?: string }>(
  items: T[] = [],
): Record<string, T> =>
  items.reduce(
    (acc, item) => ({
      ...acc,
      [getEntityKey<T>(item)]: item,
    }),
    {},
  );
