export const getEntityKey = <T extends { id?: string; key?: string }>(
  entity: T,
  useIdFirst = true,
) => {
  if (useIdFirst) return entity?.id ?? entity?.key ?? '';

  return entity?.key ?? entity?.id ?? '';
};
