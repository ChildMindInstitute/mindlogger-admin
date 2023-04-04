import { useState, useRef, useEffect, MouseEvent } from 'react';
import { AsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

import { Order } from 'shared/types';
import { workspaces } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/components';
import { GetAppletsParams } from 'api';
import { formattedOrder } from 'shared/utils';

export const useTable = (
  thunk: AsyncThunk<AxiosResponse, GetAppletsParams, Record<string, never>>,
) => {
  const dispatch = useAppDispatch();

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
      dispatch(
        thunk({
          params: {
            ownerId,
            limit: DEFAULT_ROWS_PER_PAGE,
            search: searchValue,
            page,
            ...(ordering && { ordering }),
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
    ordering,
  };
};
