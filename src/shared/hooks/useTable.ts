import { useState, useRef, useEffect, MouseEvent } from 'react';
import { AsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

import { Order, OrderBy } from 'shared/types';
import { workspaces } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/components';
import { GetAppletsParams } from 'api';
import { Roles } from 'shared/consts';

export const useTable = (
  thunk: AsyncThunk<AxiosResponse, GetAppletsParams, Record<string, never>>,
  role: string,
) => {
  const dispatch = useAppDispatch();

  const isMounted = useRef(false);

  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState<OrderBy>(OrderBy.UpdatedAt);
  const [order, setOrder] = useState<Order>('desc');

  const currentWorkspaceData = workspaces.useData();

  const handleRequestSort = (event: MouseEvent<unknown>, property: string) => {
    const orderByValue = property === 'name' ? OrderBy.DisplayName : OrderBy.UpdatedAt;
    const isAsc = order === 'asc' && orderBy === orderByValue;

    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(orderByValue);
  };

  useEffect(() => {
    const ownerId = currentWorkspaceData?.ownerId;
    if (isMounted.current && ownerId) {
      const ordering = `${order === 'asc' ? '+' : '-'}${orderBy}`;

      dispatch(
        thunk({
          params: {
            ownerId,
            limit: DEFAULT_ROWS_PER_PAGE,
            search: searchValue,
            page,
            ordering,
            role,
          },
        }),
      );

      return;
    }
    isMounted.current = true;
  }, [dispatch, page, orderBy, order, searchValue]);

  return {
    searchValue,
    setSearchValue,
    page,
    setPage,
    orderBy,
    order,
    handleRequestSort,
  };
};
