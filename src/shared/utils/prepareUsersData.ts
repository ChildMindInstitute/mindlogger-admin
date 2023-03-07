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
        .map(
          (item: Record<string, unknown> | null) =>
            item && {
              appletIds: Object.keys(item),
              ...(Object.values(item)[0] as Record<string, unknown>),
            },
        )
        .reduce((acc: Result, currentValue) => {
          if (currentValue && acc) {
            return acc.concat(currentValue);
          }

          return null;
        }, []);

export const prepareRespondentsData = <T extends Array<Record<string, unknown>>>(
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
        .map((item: Record<string, unknown> | null) => item && Object.values(item))
        .reduce((acc: Result, currentValue) => {
          if (currentValue && acc) {
            return acc.concat(
              currentValue.reduce((acc, item, index, array) => {
                if (index === 0) {
                  acc = item;
                } else {
                  const currVal = item as Record<string, unknown>;
                  const prevVal = array[index - 1] as Record<string, unknown>;
                  const accumulator = acc as Record<string, unknown>;
                  acc = {
                    ...(acc as object),
                    MRN:
                      currVal.MRN !== prevVal.MRN
                        ? `${accumulator.MRN}, ${currVal.MRN}`
                        : accumulator.MRN,
                    nickName:
                      currVal.MRN !== prevVal.MRN
                        ? `${accumulator.nickName}, ${currVal.nickName}`
                        : accumulator.nickName,
                  };
                }

                return acc;
              }, {}),
            );
          }

          return null;
        }, []);
