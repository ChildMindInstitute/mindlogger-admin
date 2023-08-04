const getNextPage = ({ listSize, limit }: { listSize: number; limit: number }) =>
  Math.floor(listSize / limit) + 1;

export const getInfinityScrollData = ({
  action,
  totalSize,
  listSize,
  limit,
  isFetching,
}: {
  action: (nextPage: number) => Promise<void>;
  totalSize: number;
  listSize: number;
  limit: number;
  isFetching: boolean;
}) => {
  const loadNextPage = async () => {
    if (totalSize === 0 || isFetching || totalSize === listSize) return;

    const nextPage = getNextPage({
      listSize,
      limit,
    });
    await action(nextPage);
  };

  return {
    loadNextPage,
  };
};
