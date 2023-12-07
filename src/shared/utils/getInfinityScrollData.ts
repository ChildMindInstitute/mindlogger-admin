const getNextPage = ({ listSize, limit }: { listSize: number; limit: number }) =>
  Math.floor(listSize / limit) + 1;

export const getInfinityScrollData = ({
  action,
  totalSize,
  listSize,
  limit,
  isLoading,
}: {
  action: (nextPage: number) => Promise<void>;
  totalSize: number;
  listSize: number;
  limit: number;
  isLoading: boolean;
}) => {
  const loadNextPage = async () => {
    if (totalSize === 0 || isLoading || totalSize === listSize) return;

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
