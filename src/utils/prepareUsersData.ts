type Result = unknown[] | null;

export const prepareUsersData = <T extends Array<Record<string, unknown>>>(
  items?: T,
  id?: string,
): Result | undefined =>
  id && items
    ? items.reduce((acc: Result, currentValue) => {
        if (currentValue[id] && acc) {
          return acc.concat(currentValue[id]);
        }

        return null;
      }, [])
    : items &&
      items
        .map((item: Record<string, unknown> | null) => item && Object.values(item)[0])
        .reduce((acc: Result, currentValue) => {
          if (currentValue && acc) {
            return acc.concat(currentValue);
          }

          return null;
        }, []);
