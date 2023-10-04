import { useState, useTransition } from 'react';

import { getInfinityScrollData } from 'shared/utils/getInfinityScrollData';
import { useIntersectionObserver } from 'shared/hooks/useIntersectionObserver';

const ROWS_PER_PAGE = 10000;

type useDataPreloader<T> = {
  data: T[];
  rootSelector?: string;
  targetSelector: string;
};

export const useDataPreloader = <T>({
  data,
  rootSelector,
  targetSelector,
}: useDataPreloader<T>): { isPending: boolean; data: T[] } => {
  const [page, setPage] = useState(0);
  const [isPending, startTransition] = useTransition();

  const totalSize = data?.length;
  const currentListSize = page * ROWS_PER_PAGE;
  const listSize = currentListSize < totalSize ? currentListSize : totalSize;

  const { loadNextPage } = getInfinityScrollData({
    action: async () => await startTransition(() => setPage((prevPage) => prevPage + 1)),
    listSize,
    totalSize,
    limit: ROWS_PER_PAGE,
    isFetching: isPending,
  });

  useIntersectionObserver({
    rootSelector,
    targetSelector,
    loadNextPage,
  });

  return {
    data: data?.slice(0, currentListSize),
    isPending,
  };
};
