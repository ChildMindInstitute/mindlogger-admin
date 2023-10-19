import { useAppDispatch } from 'redux/store';
import { AsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

import { getInfinityScrollData } from 'shared/utils/getInfinityScrollData';
import { useIntersectionObserver } from 'shared/hooks';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';

export type UseInfinityDataType = {
  rootSelector: string;
  targetSelector: string;
  listSize: number;
  totalSize: number;
  isLoading: boolean;
  limitPerPage?: number;
  getListThunk: AsyncThunk<AxiosResponse, Record<string, unknown>, Record<string, unknown>>;
};
export const useInfinityData = ({
  rootSelector,
  targetSelector,
  totalSize,
  listSize,
  isLoading,
  limitPerPage = DEFAULT_ROWS_PER_PAGE,
  getListThunk,
}: UseInfinityDataType) => {
  const dispatch = useAppDispatch();
  const { loadNextPage } = getInfinityScrollData({
    action: async (page) => {
      dispatch(
        getListThunk({
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
  });
};
