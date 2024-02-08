import { AsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

import { useAppDispatch } from 'redux/store';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { useIntersectionObserver } from 'shared/hooks';
import { getInfinityScrollData } from 'shared/utils/getInfinityScrollData';

export type UseInfinityDataType = {
  rootSelector?: string;
  targetSelector: string;
  listSize: number;
  totalSize: number;
  isLoading: boolean;
  limitPerPage?: number;
  getListThunk: AsyncThunk<AxiosResponse['data'], Record<string, unknown>, Record<string, never>>;
  params?: Record<string, unknown>;
  hasTrigger?: boolean;
};
export const useInfinityData = ({
  rootSelector,
  targetSelector,
  totalSize,
  listSize,
  isLoading,
  limitPerPage = DEFAULT_ROWS_PER_PAGE,
  getListThunk,
  params = {},
  hasTrigger = false,
}: UseInfinityDataType) => {
  const dispatch = useAppDispatch();
  const { loadNextPage } = getInfinityScrollData({
    action: async page => {
      dispatch(
        getListThunk({
          ...params,
          limit: limitPerPage,
          page,
        }),
      );
    },
    totalSize,
    listSize,
    limit: limitPerPage,
    isLoading,
  });

  useIntersectionObserver({
    rootSelector,
    targetSelector,
    onAppear: loadNextPage,
    hasTrigger,
  });
};
