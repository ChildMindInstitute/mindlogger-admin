import { INDEX_IN_NAME_REGEXP, INDEX_IN_NAME_WITH_UNDERSCORE_REGEXP } from 'shared/consts';

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
    newName = name.replace(regexp, (_, number) => (withUnderscore ? `_${+number + 1}` : `(${+number + 1})`));
  } else {
    newName = withUnderscore ? `${name}_1` : `${name} (1)`;
  }

  return getUniqueName({ name: newName, existingNames, withUnderscore });
};
