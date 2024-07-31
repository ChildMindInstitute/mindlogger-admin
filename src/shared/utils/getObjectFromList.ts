import { getEntityKey } from './getEntityKey';

export const getObjectFromList = <T extends { id?: string; key?: string }>(
  items: T[] = [],
  getUniqueKey?: (data: T) => string,
  hasIndex = false,
): Record<string, T & { index?: number }> =>
  items.reduce(
    (acc, item, index) => ({
      ...acc,
      [(getUniqueKey ?? getEntityKey)(item)]: { ...item, ...(hasIndex && { index }) },
    }),
    {},
  );
