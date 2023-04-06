import { useState, useRef, useEffect, MouseEvent } from 'react';

import { Order } from 'shared/types';
import { workspaces } from 'redux/modules';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/components';
import { GetAppletsParams } from 'api';
import { formattedOrder } from 'shared/utils';

export const useTable = (asyncFunc: (params: GetAppletsParams) => Promise<unknown>) => {
  const isMounted = useRef(false);

  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState<Order>('desc');
  const ordering = formattedOrder(orderBy, order);

  const { ownerId } = workspaces.useData() || {};

  const handleRequestSort = (event: MouseEvent<unknown>, property: string) => {
    const isAsc = order === 'asc' && orderBy === property;

    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    if (isMounted.current && ownerId) {
      const params = {
        ownerId,
        limit: DEFAULT_ROWS_PER_PAGE,
        search: searchValue,
        page,
        ...(ordering && { ordering }),
      };
      asyncFunc({
        params,
      });

      return;
    }
    isMounted.current = true;
  }, [page, orderBy, order, searchValue]);

  return {
    searchValue,
    setSearchValue,
    page,
    setPage,
    orderBy,
    order,
    handleRequestSort,
    ordering,
  };
};
