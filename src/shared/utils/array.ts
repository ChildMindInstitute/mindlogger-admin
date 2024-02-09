import get from 'lodash.get';

type Mapper<T> = {
  (item: T): string | number;
};

export const createArray = <T>(length: number, mapper: (index: number) => T): T[] =>
  Array.from({ length }).map((_, index) => mapper(index));

export const groupBy = <T, K extends keyof T>(array: T[], map: K | Mapper<T>): Record<string, T[]> =>
  array.reduce((result: Record<string, T[]>, item) => {
    const key = typeof map === 'function' ? map(item) : item[map];

    return {
      ...result,
      [`${key}`]: [...(result[`${key}`] ?? []), item],
    };
  }, {});

export const pluck = (array: unknown[], attribute: string) => array.map((item) => get(item, attribute));

export const createArrayFromMinToMax = (min: number, max: number) =>
  Array.from({ length: max - min + 1 }, (_, i) => i + min);

export const without = <T>(source?: T[], data?: T | T[]): T[] => {
  if (Array.isArray(data)) return source?.filter((item) => !data?.includes(item)) ?? [];

  return source?.filter((item) => item !== data) ?? [];
};
