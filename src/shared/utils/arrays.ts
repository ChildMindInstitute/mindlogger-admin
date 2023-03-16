export const createArray = <T>(length: number, mapper: (index: number) => T): T[] =>
  Array.from({ length }).map((_, index) => mapper(index));
