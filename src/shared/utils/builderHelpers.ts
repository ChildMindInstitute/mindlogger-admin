import { INDEX_IN_NAME_REGEXP, INDEX_IN_NAME_WITH_UNDERSCORE_REGEXP } from 'shared/consts';

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

export const getUniqueName = ({
  name,
  existingNames,
  withUnderscore,
}: {
  name: string;
  existingNames?: string[];
  withUnderscore?: boolean;
}): string => {
  if (!existingNames?.includes(name)) return name;

  const regexp = withUnderscore ? INDEX_IN_NAME_WITH_UNDERSCORE_REGEXP : INDEX_IN_NAME_REGEXP;
  const match = name.match(regexp);
  let newName;

  if (match) {
    newName = name.replace(regexp, (_, number) =>
      withUnderscore ? `_${+number + 1}` : `(${+number + 1})`,
    );
  } else {
    newName = withUnderscore ? `${name}_1` : `${name} (1)`;
  }

  return getUniqueName({ name: newName, existingNames, withUnderscore });
};
