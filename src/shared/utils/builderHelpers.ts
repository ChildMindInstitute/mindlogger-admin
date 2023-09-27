import { INDEX_IN_NAME_REGEXP } from 'shared/consts';

export const getEntityKey = <T extends { id?: string; key?: string }>(
  entity: T,
  useIdFirst = true,
) => {
  if (useIdFirst) return entity?.id ?? entity?.key ?? '';

  return entity?.key ?? entity?.id ?? '';
};

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

export const getUniqueName = (name: string, existingNames?: string[]): string => {
  if (!existingNames?.includes(name)) return name;

  const newName = name.match(INDEX_IN_NAME_REGEXP)
    ? name.replace(INDEX_IN_NAME_REGEXP, (_, number) => `(${+number + 1})`)
    : `${name} (1)`;

  return getUniqueName(newName, existingNames);
};
