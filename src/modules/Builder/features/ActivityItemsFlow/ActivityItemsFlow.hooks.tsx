import { useState, useTransition } from 'react';

import { getInfinityScrollData } from 'shared/utils';
import { useIntersectionObserver } from 'shared/hooks';
import { ConditionalLogic } from 'shared/state';

import {
  ACTIVITY_ITEMS_FLOW_END_ITEM_CLASS,
  ACTIVITY_ITEMS_FLOW_LIST_CLASS,
  ACTIVITY_ITEMS_FLOW_ROWS_PER_PAGE,
} from './ActivityItemsFlow.const';

export const useItemsFlowSlicedData = (data: ConditionalLogic[]) => {
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const totalSize = data?.length;
  const currentListSize = page * ACTIVITY_ITEMS_FLOW_ROWS_PER_PAGE;
  const listSize = currentListSize < totalSize ? currentListSize : totalSize;

  const { loadNextPage } = getInfinityScrollData({
    action: async () => await startTransition(() => setPage((prevPage) => prevPage + 1)),
    listSize,
    totalSize,
    limit: ACTIVITY_ITEMS_FLOW_ROWS_PER_PAGE,
    isFetching: isPending,
  });

  useIntersectionObserver({
    rootSelector: `.${ACTIVITY_ITEMS_FLOW_LIST_CLASS}`,
    targetSelector: `.${ACTIVITY_ITEMS_FLOW_END_ITEM_CLASS}`,
    loadNextPage,
  });

  return {
    data: data?.slice(0, currentListSize),
    isPending,
  };
};
