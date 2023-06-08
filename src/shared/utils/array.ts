export const createArray = <T>(length: number, mapper: (index: number) => T): T[] =>
  Array.from({ length }).map((_, index) => mapper(index));

interface Mapper<T> {
  (item: T): string;
}

export const groupBy = <T, K extends keyof T>(
  array: T[],
  map: K | Mapper<T>,
): Record<string, T[]> =>
  array.reduce((result: Record<string, T[]>, item) => {
    const key = typeof map === 'function' ? map(item) : item[map];

    return {
      ...result,
      [`${key}`]: [...(result[`${key}`] ?? []), item],
    };
  }, {});
