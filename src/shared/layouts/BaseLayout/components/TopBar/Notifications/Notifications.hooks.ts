import { useAppDispatch } from 'redux/store';
import { alerts } from 'shared/state';
import { getInfinityScrollData } from 'shared/utils';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { useIntersectionObserver } from 'shared/hooks';

import { ALERT_END_ITEM_CLASS, ALERT_LIST_CLASS } from './Notifications.const';

export const useInfinityData = () => {
  const dispatch = useAppDispatch();
  const { result: alertList = [], count = 0 } = alerts.useAlertsData() ?? {};
  const alertListStatus = alerts.useAlertsStatus() ?? {};

  const { loadNextPage } = getInfinityScrollData({
    action: async (page) => {
      dispatch(
        alerts.thunk.getAlerts({
          limit: DEFAULT_ROWS_PER_PAGE,
          page,
        }),
      );
    },
    totalSize: count,
    listSize: alertList.length,
    limit: DEFAULT_ROWS_PER_PAGE,
    isFetching: alertListStatus === 'loading',
  });

  useIntersectionObserver({
    rootSelector: `.${ALERT_LIST_CLASS}`,
    targetSelector: `.${ALERT_END_ITEM_CLASS}`,
    loadNextPage,
  });
};
