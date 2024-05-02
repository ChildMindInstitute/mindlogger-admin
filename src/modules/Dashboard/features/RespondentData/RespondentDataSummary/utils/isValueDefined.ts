export const isValueDefined = <T extends string | number | (string | number)[] | null>(
  value?: T,
): value is NonNullable<T> => value !== null && value !== undefined;
