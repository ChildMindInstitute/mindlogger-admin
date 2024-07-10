import { useState, useEffect, MouseEvent, useRef, useMemo } from 'react';

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

  const params = useMemo(
    () => ({
      ownerId,
      limit,
      search: searchValue,
      page,
      ...(ordering && { ordering }),
    }),
    [ownerId, limit, searchValue, page, ordering],
  );

  // Ref required to eliminate closure reference errors and reduce redundant rerenders
  const paramsRef = useRef(params);
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const handleRequestSort = (_event: MouseEvent<unknown>, property: string) => {
    const isAsc = order === 'asc' && orderBy === property;
    const orderValue = isAsc ? 'desc' : 'asc';

    setOrder(orderValue);
    setOrderBy(property);

    asyncFunc({
      params: {
        ...paramsRef.current,
        ordering: formattedOrder(property, orderValue),
      },
    });
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    const nextPage = newPage + 1;
    setPage(nextPage);

    asyncFunc({
      params: {
        ...paramsRef.current,
        page: nextPage,
      },
    });
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setPage(defaultParams.page);
    asyncFunc({
      params: {
        ...paramsRef.current,
        page: defaultParams.page,
        search: value,
      },
    });
  };

  const handleReload = () => {
    asyncFunc({ params: paramsRef.current });
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
