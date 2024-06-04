import { useState, useEffect, MouseEvent } from 'react';

import { Order } from 'shared/types';
import { workspaces } from 'redux/modules';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { GetAppletsParams } from 'api';
import { formattedOrder } from 'shared/utils/table';

const defaultParams = {
  searchValue: '',
  order: 'desc' as Order,
  orderBy: '',
  page: 1,
};

export const useTable = (
  asyncFunc: (params: GetAppletsParams) => Promise<unknown>,
  limit = DEFAULT_ROWS_PER_PAGE,
  defaultOrderBy = defaultParams.orderBy,
  defaultOrder = defaultParams.order,
) => {
  const [searchValue, setSearchValue] = useState(defaultParams.searchValue);
  const [page, setPage] = useState(defaultParams.page);
  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  const [order, setOrder] = useState(defaultOrder);

  const ordering = formattedOrder(orderBy, order);

  const { ownerId } = workspaces.useData() || {};

  const params = {
    ownerId,
    limit,
    search: searchValue,
    page,
    ...(ordering && { ordering }),
  };

  const handleRequestSort = (event: MouseEvent<unknown>, property: string) => {
    const isAsc = order === 'asc' && orderBy === property;
    const orderValue = isAsc ? 'desc' : 'asc';

    setOrder(orderValue);
    setOrderBy(property);

    asyncFunc({
      params: {
        ...params,
        ordering: formattedOrder(property, orderValue),
      },
    });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    const nextPage = newPage + 1;
    setPage(nextPage);

    asyncFunc({
      params: {
        ...params,
        page: nextPage,
      },
    });
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setPage(defaultParams.page);
    asyncFunc({
      params: {
        ...params,
        page: defaultParams.page,
        search: value,
      },
    });
  };

  const handleReload = () => {
    asyncFunc({ params });
  };

  useEffect(() => {
    if (ownerId) {
      setPage(defaultParams.page);
      setSearchValue(defaultParams.searchValue);
      setOrder(defaultOrder);
      setOrderBy(defaultOrderBy);
    }
  }, [ownerId]);

  return {
    searchValue,
    page,
    orderBy,
    order,
    ordering,
    handleRequestSort,
    handleChangePage,
    handleSearch,
    handleReload,
  };
};
