export const sortItemsByOrder = <T extends { order?: number }>(items: T[] | null) => {
  if (!items) return null;

  return items.sort((a, b) => {
    if (a.order === undefined && b.order === undefined) {
      return 0;
    } else if (a.order === undefined) {
      return 1;
    } else if (b.order === undefined) {
      return -1;
    }

    return a.order - b.order;
  });
};
